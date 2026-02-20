import { Link } from "react-router-dom";

export default function InfoGridTop() {
  return (
    <section className="mt-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoCard color="bg-[#93D5B3]" icon="hub" title="Index_Events">
          <p className="text-[11px] leading-relaxed opacity-80">
            INDEX BY ZAKA nasce come uno spazio ibrido. Un luogo in cui l’arte
            convive con il prodotto e il prodotto attraversa la massa. Un archivio
            in movimento dove l’immagine può diventare oggetto, e l’oggetto può
            tornare racconto.
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            <Badge>Next_Drop: updating</Badge>
            <Badge>Channel_02: in_progress</Badge>
            <Badge>Monthly_Artwork: PALERMO</Badge>
          </div>
        </InfoCard>

        <InfoCard color="bg-[#FFD166]" icon="auto_awesome" title="About_Project.txt">
          <p className="text-[11px] leading-relaxed opacity-80">
            Se desideri collezionare anche tu un frammento del progetto, puoi
            farlo attraverso lo shop. Ogni prodotto è una versione dedicata
            dell’opera, pensata per essere vissuta nella quotidianità.
          </p>

          <Link
            to="/shop"
            className="inline-block mt-4 border-4 border-[#5D172E] bg-white px-3 py-2 text-[10px] font-bold uppercase shadow-[3px_3px_0px_0px_#5D172E] transition-all active:translate-y-0.5 active:shadow-none"
          >
            Click_to_collect
          </Link>
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

function Badge({ children }) {
  return (
    <span className="border-2 border-[#5D172E] px-2 py-1 text-[10px] font-bold uppercase bg-white">
      {children}
    </span>
  );
}
