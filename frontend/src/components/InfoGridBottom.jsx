import { Link } from "react-router-dom";

export default function InfoGridBottom() {
  return (
    <section className="mt-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoCard color="bg-[#7EB3D1]" icon="mail" title="Contacts">
          <p className="text-sm md:text-base leading-relaxed opacity-80">
            This archive remains open to connection.
            To collaborations, proposals, conversations,
            or even the simplest signal of presence.
          </p>

          <div className="mt-3 text-sm md:text-base space-y-1">
            <p>
              Email: <span className="font-bold">hello@indexbyzaka.it</span>
            </p>
          </div>

          <a
            href="mailto:hello@indexbyzaka.it"
            className="inline-block mt-4 ui-btn"
          >
            Send_Message
          </a>
        </InfoCard>

        <InfoCard color="bg-[#B8B8FF]" icon="gavel" title="Legal_Framework">
          <ul className="text-sm md:text-base opacity-80 space-y-2 list-disc pl-4">
            <li>
              <Link to="/terms" className="hover:underline">
                Terms_And_Conditions
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:underline">
                Privacy_Policy
              </Link>
            </li>
            <li>Cookie_Policy</li>
            <li>Shipping_And_Returns</li>
          </ul>
        </InfoCard>
      </div>
    </section>
  );
}

function InfoCard({ color, icon, title, subtitle, children }) {
  return (
    <div className="ui-card">
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

      <div className="p-4">{children}</div>
    </div>
  );
}