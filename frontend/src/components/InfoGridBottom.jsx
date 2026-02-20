import { Link } from "react-router-dom";

export default function InfoGridBottom() {
  return (
    <section className="mt-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoCard color="bg-[#7EB3D1]" icon="mail" title="Contacts">
          <p className="text-[11px] leading-relaxed opacity-80">
            Questo archivio rimane aperto a connessioni. Collaborazioni,
            proposte, conversazioni o semplici segnali di presenza.
          </p>

          <div className="mt-3 text-[11px] space-y-1">
            <p>
              Email: <span className="font-bold">hello@indexbyzaka.it</span>
            </p>
          </div>

          <a
            href="mailto:hello@indexbyzaka.it"
            className="inline-block mt-4 border-4 border-[#5D172E] bg-white px-3 py-2 text-[10px] font-bold uppercase shadow-[3px_3px_0px_0px_#5D172E] transition-all active:translate-y-0.5 active:shadow-none"
          >
            Send_Message
          </a>
        </InfoCard>

        <InfoCard
          color="bg-[#B8B8FF]"
          icon="gavel"
          title="Legal_Framework.sys"
          subtitle="Transparency & Terms"
        >
          <ul className="text-[11px] opacity-80 space-y-2 list-disc pl-4">
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
    <div className="border-4 border-[#5D172E] bg-white shadow-[6px_6px_0px_0px_#5D172E] overflow-hidden">
      <div
        className={`${color} border-b-4 border-[#5D172E] p-3 text-[#5D172E] flex items-center justify-between`}
      >
        <div className="flex items-center gap-2 font-bold">
          <span className="material-symbols-outlined">{icon}</span>
          <div>
            <h3 className="text-xs uppercase">{title}</h3>
            {subtitle ? (
              <p className="text-[10px] font-bold opacity-80">{subtitle}</p>
            ) : null}
          </div>
        </div>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}
