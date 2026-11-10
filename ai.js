// ===== НАСТРОЙКИ QAZ COACH =====
const AI_PROVIDER = 'anthropic'; // 'openai' (ChatGPT), 'anthropic' (Claude), 'proxy' (свой сервер)
const AI_API_KEY = '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';       // Впишите API-ключ выбранного провайдера
const AI_MODEL = 'claude-fable-5-1';         // Впишите ID модели, доступной в вашем API-аккаунте

/* Прямое подключение — для локальной проверки. Ключ в этом файле виден
   посетителям сайта: не публикуйте файл с ключом и не коммитьте ключ в Git.
   Для публикации выберите 'proxy', очистите AI_API_KEY и храните ключ на сервере.
   В режиме proxy используется window.FITQAZ_AI_URL или '/api/chat';
   сервер принимает { system, messages, user } и возвращает { reply: "Текст" }.
   В прямом режиме имя и группа пользователя провайдеру не передаются.
*/
// При подключении провайдера закрепите эту инструкцию на сервере.
window.FITQAZ_SYSTEM_PROMPT = `Ты — QAZ Coach, помощник по адаптивной физкультуре в приложении FITQAZ для студентов КарТУ.
Твоя основная задача — помочь студенту, который не может выполнить норматив из-за ограничений здоровья, подготовить варианты замены для обсуждения с преподавателем.
Отвечай на языке вопроса: на казахском или русском. Пиши понятно, доброжелательно и кратко; обычно достаточно 6 предложений или короткого списка.

Порядок работы:
1. Уточни, какой норматив нужно заменить, какие движения или нагрузки студенту запрещены либо вызывают трудности и какие ограничения или разрешённые нагрузки уже указал врач. Задавай не более трёх вопросов за раз и учитывай ответы из истории, не спрашивая повторно. Не требуй диагноз, медицинские документы или другие личные сведения: достаточно описания ограничений.
2. Если ограничения неизвестны или студент сообщает о боли, травме либо обострении, не подбирай персональные упражнения и нагрузку наугад. Предложи уточнить допустимые нагрузки у врача и обсудить с преподавателем отсрочку или нефизическое задание.
3. Когда информации достаточно, предложи 2–3 возможные альтернативы, которые не противоречат описанным запретам. Для каждой кратко укажи: какой норматив она заменяет, какое качество развивает, какие движения предполагает и что нужно согласовать. Не считай упражнение безопасным только потому, что оно выглядит лёгким; если допустимость сомнительна, обозначь это и не рекомендуй его выполнять до уточнения.
4. Не назначай точные веса, темп, дистанции, число повторений или длительность при медицинских ограничениях без индивидуальных рекомендаций специалиста. Можно опираться на уже сообщённые разрешения врача, не расширяя их. Не ставь диагнозы, не назначай лечение и не советуй тренироваться через боль или нарушать медицинский запрет. При описании потенциально неотложного состояния прекрати подбор упражнений и посоветуй срочно обратиться за медицинской помощью.
5. Если физическая нагрузка запрещена или подходящая замена неясна, предложи обсудить с преподавателем теоретическое задание, разбор техники, проект или отсрочку, явно обозначив, что такие варианты могут быть не предусмотрены правилами вуза.
6. Заверши конкретным следующим шагом: предложи согласовать выбранную замену и критерии её оценки с преподавателем, а допустимость нагрузки при необходимости — с врачом. Можешь помочь составить короткое обращение к преподавателю без раскрытия диагноза.

Границы полномочий:
Ты предлагаешь варианты для согласования, а не выдаёшь медицинский допуск и не закрываешь норматив. Не обещай зачёт, баллы или освобождение и не выдумывай правила КарТУ, официальные эквиваленты нормативов либо одобрение преподавателя. Окончательное решение о замене и зачёте принимает преподаватель по правилам вуза с учётом медицинских ограничений.
Также можно отвечать на общие вопросы о физкультуре, тренировках и восстановлении. Если вопрос не относится к этим темам, вежливо верни разговор к ним.`;

window.FITQAZ_askAI = async function (messages, user) {
  if (!Array.isArray(messages) || !messages.length) {
    throw new Error('Напишите вопрос тренеру.');
  }

  // Не передаём системные роли и произвольные поля из истории браузера.
  const history = messages.slice(-12).map(message => {
    if (!message || !['user', 'assistant'].includes(message.role) ||
        typeof message.content !== 'string' || !message.content.trim()) {
      throw new Error('История диалога повреждена. Начните новый диалог.');
    }
    if (message.content.length > 12000) {
      throw new Error('Сообщение слишком длинное. Сократите его до 12 000 символов.');
    }
    return { role: message.role, content: message.content.trim() };
  });
  while (history.length && history[0].role !== 'user') history.shift();
  if (!history.length || history[history.length - 1].role !== 'user') {
    throw new Error('Напишите вопрос тренеру.');
  }

  const provider = AI_PROVIDER.trim().toLowerCase();
  if (!['openai', 'anthropic', 'proxy'].includes(provider)) {
    throw new Error('Укажите AI_PROVIDER: openai, anthropic или proxy в ai.js.');
  }
  const key = AI_API_KEY.trim(), model = AI_MODEL.trim();
  if (provider !== 'proxy' && (!key || !model)) {
    throw new Error('Заполните AI_API_KEY и AI_MODEL в начале ai.js.');
  }

  let url = window.FITQAZ_AI_URL || '/api/chat';
  const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
  let body = {
    system: window.FITQAZ_SYSTEM_PROMPT,
    messages: history,
    user: {
      name: typeof user?.name === 'string' ? user.name : '',
      role: user?.role === 'teacher' ? 'teacher' : 'student',
      group: typeof user?.group === 'string' ? user.group : ''
    }
  };
  if (provider === 'openai') {
    url = 'https://api.openai.com/v1/responses';
    headers.Authorization = 'Bearer ' + key;
    body = { model, instructions: window.FITQAZ_SYSTEM_PROMPT, input: history,
      max_output_tokens: 2048, store: false };
  } else if (provider === 'anthropic') {
    url = 'https://api.anthropic.com/v1/messages';
    headers['x-api-key'] = key;
    headers['anthropic-version'] = '2023-06-01';
    headers['anthropic-dangerous-direct-browser-access'] = 'true';
    body = { model, system: window.FITQAZ_SYSTEM_PROMPT, messages: history, max_tokens: 2048 };
  }

  const controller = new AbortController();
  // Ограничиваем ожидание, включая чтение тела ответа.
  const timeout = setTimeout(() => controller.abort(), 45000);
  try {
    const response = await fetch(url, {
      method: 'POST', headers, signal: controller.signal,
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errors = {
        400: 'Проверьте ID модели и параметры запроса к ИИ.',
        401: 'Проверьте API-ключ и разрешение аккаунта на запросы из браузера.',
        403: 'Доступ к сервису ИИ запрещён. Обратитесь к администратору.',
        404: 'Модель или адрес сервиса ИИ не найдены. Проверьте настройки.',
        405: 'Сервис QAZ Coach ещё не настроен для приёма сообщений.',
        413: 'Диалог слишком длинный. Сократите сообщение.',
        429: 'Лимит запросов к ИИ исчерпан. Попробуйте позже.'
      };
      // Не показываем сырые ошибки провайдера: они могут содержать служебные данные.
      throw new Error(errors[response.status] ||
        'Сервис ИИ временно недоступен. Попробуйте позже.');
    }

    let data;
    try {
      data = await response.json();
    } catch (error) {
      if (controller.signal.aborted) throw error;
      throw new Error('Сервис ИИ вернул некорректный ответ. Попробуйте позже.');
    }
    let reply = data?.reply;
    if (provider === 'openai') {
      if (data?.status === 'incomplete') {
        throw new Error('Ответ ИИ не завершён. Попробуйте задать более короткий вопрос.');
      }
      const output = Array.isArray(data?.output) ? data.output : [];
      reply = output.filter(item => item?.type === 'message')
        .flatMap(item => Array.isArray(item.content) ? item.content : [])
        .map(part => part?.type === 'output_text' ? part.text :
          part?.type === 'refusal' ? part.refusal : '')
        .filter(text => typeof text === 'string').join('\n');
    } else if (provider === 'anthropic') {
      if (data?.stop_reason === 'max_tokens') {
        throw new Error('Ответ ИИ не завершён. Попробуйте задать более короткий вопрос.');
      }
      const content = Array.isArray(data?.content) ? data.content : [];
      reply = content.filter(part => part?.type === 'text' && typeof part.text === 'string')
        .map(part => part.text).join('\n');
    }
    if (typeof reply !== 'string' || !reply.trim()) {
      throw new Error('Сервис ИИ не вернул текст ответа. Попробуйте ещё раз.');
    }
    return reply.trim();
  } catch (error) {
    if (controller.signal.aborted) {
      throw new Error('ИИ не успел ответить за 45 секунд. Попробуйте ещё раз.');
    }
    if (error instanceof TypeError) {
      throw new Error('Нет связи с сервисом ИИ. Проверьте интернет и попробуйте ещё раз.');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
};
