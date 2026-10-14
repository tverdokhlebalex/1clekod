import { ArrowUpRight, Check, CircleAlert } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import type { IconName } from "@/lib/icons";

type Row = { title: string; meta: string; state: string; progress: number };
type Lane = { label: string; value: string };
type Channel = { label: string; icon: IconName };

export type HeroPanelData = {
  title: string;
  status: string;
  noticeTitle: string;
  noticeText: string;
  rows: Row[];
  lanes: Lane[];
  taskTitle: string;
  taskText: string;
  channels: Channel[];
};

export function HeroPanel({ panel }: { panel: HeroPanelData }) {
  const [hub, ...channels] = panel.channels;

  return (
    <div className="home-monitor" role="img" aria-label="Пример экрана контура 1С: обмены, документы и заявка программисту. Это не показатели конкретного клиента.">
      <div className="home-monitor__bar">
        <span className="home-monitor__title"><span className="home-monitor__mark" />{panel.title}</span>
        <span className="home-monitor__status"><i />{panel.status}</span>
      </div>
      <div className="home-monitor__network">
        {hub && <div className="home-monitor__hub"><Icon name={hub.icon} size={20} /><strong>{hub.label}</strong></div>}
        <div className="home-monitor__branches">
          {channels.map((channel) => (
            <div className="home-monitor__branch" key={channel.label}>
              <span className="home-monitor__connector"><i /></span>
              <div className="home-monitor__node"><Icon name={channel.icon} size={19} /><span>{channel.label}</span><i /></div>
            </div>
          ))}
        </div>
      </div>
      <div className="home-monitor__rows">
        {panel.rows.map((row) => (
          <div className="home-monitor__row" key={row.title}>
            <span className={`home-monitor__row-icon ${row.progress === 100 ? "is-complete" : ""}`}>
              {row.progress === 100 ? <Check size={15} /> : <ArrowUpRight size={15} />}
            </span>
            <div className="home-monitor__row-copy"><strong>{row.title}</strong><span>{row.meta}</span></div>
            <div className="home-monitor__progress"><span>{row.state}</span><div><i style={{ width: `${row.progress}%` }} /></div></div>
          </div>
        ))}
      </div>
      <div className="home-monitor__notice"><Check size={16} /><div><strong>{panel.noticeTitle}</strong><p>{panel.noticeText}</p></div></div>
      <div className="home-monitor__lanes">
        {panel.lanes.map((lane) => <div key={lane.label}><strong>{lane.value}</strong><span>{lane.label}</span></div>)}
      </div>
      <div className="home-monitor__task"><CircleAlert size={16} /><div><strong>{panel.taskTitle}</strong><p>{panel.taskText}</p></div></div>
    </div>
  );
}
