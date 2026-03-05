import { Link } from "react-router-dom";

export default function InfoGridTop() {
  return (
    <section className="mt-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
        <InfoCard color="bg-[#93D5B3]" icon="hub" title="Index_Events">
          <p className="text-sm md:text-base leading-relaxed opacity-80">
            INDEX BY ZAKA is born as a hybrid space. A place where art coexists
            with product, and product moves through the mass. A living archive in
            motion, where an image can become an object, and the object can
            return as a story.
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            <Badge>Next_Drop: updating</Badge>
            <Badge>Channel_02: in_progress</Badge>
            <Badge>Monthly_Artwork: PALERMO</Badge>
          </div>
        </InfoCard>

        <InfoCard color="bg-[#FFD166]" icon="auto_awesome" title="About_Project.txt">
          <div className="flex flex-col h-full">
            <p className="text-sm md:text-base leading-relaxed opacity-80">
              If you wish to collect a fragment of the project, you can explore the
              shop. Each product represents a dedicated edition of the work, created
              to exist within daily life.
            </p>

            <div className="mt-auto pt-4">
              <Link to="/shop" className="ui-btn">
                Click_to_collect
              </Link>
            </div>
          </div>
        </InfoCard>
      </div>
    </section>
  );
}

function InfoCard({ color, icon, title, subtitle, children }) {
  return (
    <div className="ui-card flex flex-col h-full">
      <div className={`ui-bar ${color}`}>
        <div className="flex items-center gap-2 font-bold">
          <span className="material-symbols-outlined text-base">{icon}</span>
          <div>
            <h3 className="ui-label">{title}</h3>
            {subtitle ? (
              <p className="text-xs md:text-sm font-bold opacity-80 tracking-wide">
                {subtitle}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="p-4 flex-1">{children}</div>
    </div>
  );
}

function Badge({ children }) {
  return <span className="ui-badge">{children}</span>;
}