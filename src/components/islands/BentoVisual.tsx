import { ArrowRight, Check, CircleAlert, Database, FileText, RefreshCw } from "lucide-react";

type Kind = "queue" | "exchange" | "deal" | "audit" | "urgent";

const queue = [
  { title: "Проведение реализации", state: "В работе", live: true },
  { title: "Обновление УТ на копии", state: "В очереди", live: false },
  { title: "Обмен заказов с сайтом", state: "Готово", live: false }
];
const audit = [
  { title: "Доступы к базе", state: "Есть" },
  { title: "Журнал обменов", state: "Смотрим" },
  { title: "Резервная копия", state: "Свежая" }
];

export function BentoVisual({ kind }: { kind: Kind }) {
  if (kind === "queue") return (
    <div aria-hidden className="service-demo service-demo--queue">
      <p className="service-demo__caption"><span className="service-demo__dot" />Очередь задач · пример</p>
      <div className="service-demo__queue">
        {queue.map((item, index) => <div className={item.live ? "is-active" : ""} key={item.title}>
          <span className="service-demo__task-icon">{index === 2 ? <Check size={15} /> : <FileText size={15} />}</span>
          <span>{item.title}</span><small>{item.state}</small>
        </div>)}
      </div>
    </div>
  );

  if (kind === "exchange") return (
    <div aria-hidden className="service-demo service-demo--exchange">
      <p className="service-demo__caption">Передача данных · пример</p>
      <div className="service-demo__flows"><Flow from="1С" to="Сайт" /><Flow from="Сайт" to="Склад" reverse /></div>
      <svg className="service-demo__wave" viewBox="0 0 360 46" fill="none">
        <path d="M0 36H360M0 16H360" stroke="currentColor" opacity=".12" />
        <path d="M0 35H40L48 29H78L86 35H126L138 12L147 28H172L184 7L196 28H226L238 18L248 25H272L283 6L294 21H326L340 12H360" stroke="currentColor" strokeWidth="2" />
      </svg>
    </div>
  );

  if (kind === "deal") return (
    <div aria-hidden className="service-demo service-demo--deal">
      <p className="service-demo__caption">Сделка уходит в учёт · пример</p>
      <div className="service-demo__sync">
        <div className="service-demo__endpoint"><span>Битрикс24</span><strong>Сделка</strong></div>
        <div className="service-demo__sync-line"><RefreshCw size={18} /></div>
        <div className="service-demo__endpoint service-demo__endpoint--gold"><span>1С</span><strong><Check size={14} />Заказ</strong></div>
      </div>
    </div>
  );

  if (kind === "audit") return (
    <div aria-hidden className="service-demo service-demo--audit">
      <p className="service-demo__caption">Проверка контура · пример</p>
      <div className="service-demo__diagnostic">
        <div className="service-demo__scan"><Database size={25} /><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="43" /><circle cx="50" cy="50" r="43" /></svg></div>
        <div className="service-demo__checks">{audit.map((item) => <div key={item.title}><span>{item.title}</span><strong>{item.state}</strong></div>)}</div>
      </div>
    </div>
  );

  return (
    <div aria-hidden className="service-demo service-demo--urgent">
      <div className="service-demo__error"><CircleAlert size={20} /><strong>Не проводится</strong><i /></div>
      <div className="service-demo__incident"><span>Обмен встал</span><ArrowRight size={16} /><span>Смотрим симптом</span></div>
      <div className="service-demo__trace"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>
    </div>
  );
}

function Flow({ from, to, reverse = false }: { from: string; to: string; reverse?: boolean }) {
  return <div className={`service-demo__flow ${reverse ? "is-reverse" : ""}`}>
    <span>{from}</span><div><i /><i /><i /></div><ArrowRight size={14} /><span>{to}</span>
  </div>;
}
