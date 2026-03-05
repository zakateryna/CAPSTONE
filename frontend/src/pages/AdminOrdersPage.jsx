import { useEffect, useMemo, useState } from "react";

const STATUSES = ["PENDING", "PAID", "FAILED", "CANCELED", "REFUNDED"];

function centsToEUR(cents) {
  const n = Number(cents || 0) / 100;
  return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(n);
}

function fmtDate(iso) {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat("it-IT", { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));
  } catch {
    return String(iso);
  }
}

function getSavedToken() {
  return sessionStorage.getItem("admin_token") || "";
}

function StatusChip({ status }) {
  const map = {
    PAID: "ui-panel ui-panel-ok",
    PENDING: "ui-panel ui-panel-warn",
    FAILED: "ui-panel",
    CANCELED: "ui-panel",
    REFUNDED: "ui-panel ui-panel-info",
  };
  return (
    <span className={`${map[status] || "ui-panel"} px-2 py-1 text-[11px] md:text-xs font-bold uppercase tracking-wide`}>
      {status}
    </span>
  );
}

export default function AdminOrdersPage() {
  const [token, setToken] = useState(getSavedToken());

  // menu stato (ALL oppure uno degli enum)
  const [statusTab, setStatusTab] = useState("ALL");

  const [q, setQ] = useState("");
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);

  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const headers = useMemo(
    () => ({
      "Content-Type": "application/json",
      "x-admin-token": token,
    }),
    [token]
  );

  // conteggi veloci lato client (sui risultati caricati)
  const counts = useMemo(() => {
    const c = { ALL: items.length };
    for (const s of STATUSES) c[s] = 0;
    for (const o of items) c[o.status] = (c[o.status] || 0) + 1;
    return c;
  }, [items]);

  const loadOrders = async (nextTab = statusTab) => {
    if (!token) return;

    setErr("");
    setBusy(true);
    try {
      const params = new URLSearchParams();
      if (nextTab && nextTab !== "ALL") params.set("status", nextTab);
      if (q.trim()) params.set("q", q.trim());

      const res = await fetch(`/api/admin/orders?${params.toString()}`, { headers });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.code || "FAILED");

      setItems(data.items || []);

      // se avevi un selected che non esiste più nella lista filtrata, lo lasciamo comunque
    } catch {
      setItems([]);
      setSelected(null);
      setErr("Token non valido oppure backend non raggiungibile.");
    } finally {
      setBusy(false);
    }
  };

  const loadOrder = async (id) => {
    if (!token) return;

    setErr("");
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, { headers });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.code || "FAILED");
      setSelected(data.order);
    } catch {
      setSelected(null);
      setErr("Errore caricamento ordine.");
    } finally {
      setBusy(false);
    }
  };

  const saveStatus = async () => {
    if (!selected || !token) return;

    setErr("");
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/orders/${selected._id}/status`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ status: selected.status }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.code || "FAILED");

      setSelected(data.order);

      // ricarica la lista nel tab corrente
      await loadOrders(statusTab);
    } catch {
      setErr("Errore salvataggio status.");
    } finally {
      setBusy(false);
    }
  };

  const saveToken = () => {
    sessionStorage.setItem("admin_token", token);
    loadOrders("ALL");
  };

  useEffect(() => {
    if (token) loadOrders("ALL");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onTab = (tab) => {
    setStatusTab(tab);
    loadOrders(tab);
  };

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-4 animate-fadeIn">
      {/* TOP CONSOLE */}
      <div className="ui-card">
        <div className="ui-bar bg-[color:var(--color-retro-taskbar)]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-base">terminal</span>
            <h1 className="ui-label text-sm md:text-base">Orders_ControlRoom</h1>
          </div>

          <button className="ui-btn px-2 py-1" onClick={() => loadOrders(statusTab)} disabled={busy || !token}>
            Refresh
          </button>
        </div>

        <div className="p-4 space-y-3">
          <div className="flex flex-col md:flex-row gap-2 md:items-center">
            <input
              className="ui-input w-full md:flex-1 h-11"
              placeholder="ADMIN_TOKEN"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
            <button className="ui-btn h-11" onClick={saveToken} disabled={busy || !token}>
              Save token
            </button>

            <input
              className="ui-input w-full md:w-[280px] h-11"
              placeholder="Search email…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              disabled={!token}
            />

            <button className="ui-btn h-11" onClick={() => loadOrders(statusTab)} disabled={busy || !token}>
              Apply
            </button>
          </div>

          {/* STATUS MENU */}
          <div className="ui-panel ui-panel-soft flex flex-wrap gap-2 items-center">
            <span className="ui-label text-xs md:text-sm">Filter_Status</span>

            <button
              className={`ui-navbtn ${statusTab === "ALL" ? "ui-navbtn-active" : ""}`}
              onClick={() => onTab("ALL")}
              disabled={!token || busy}
              type="button"
            >
              ALL <span className="opacity-70">({counts.ALL || 0})</span>
            </button>

            {STATUSES.map((s) => (
              <button
                key={s}
                className={`ui-navbtn ${statusTab === s ? "ui-navbtn-active" : ""}`}
                onClick={() => onTab(s)}
                disabled={!token || busy}
                type="button"
              >
                {s} <span className="opacity-70">({counts[s] || 0})</span>
              </button>
            ))}
          </div>

          {err ? <div className="ui-panel ui-panel-warn text-sm">{err}</div> : null}
          {!token ? (
            <div className="ui-panel ui-panel-info text-sm">
              Inserisci <span className="font-bold">ADMIN_TOKEN</span> per accedere alla lista ordini.
            </div>
          ) : null}
        </div>
      </div>

      {/* MAIN */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* LIST */}
        <div className="lg:col-span-5 ui-card">
          <div className="ui-bar bg-[#93D5B3]">
            <span className="ui-label text-sm md:text-base">Orders.list</span>
            <span className="ui-badge bg-white text-[10px] md:text-xs">{items.length}</span>
          </div>

          <div className="p-4 space-y-2">
            {!items.length ? (
              <p className="text-sm opacity-70">{token ? "Nessun ordine in questo filtro." : "Inserisci token."}</p>
            ) : (
              items.map((o) => (
                <button
                  key={o._id}
                  onClick={() => loadOrder(o._id)}
                  className={[
                    "w-full text-left ui-card-sm p-3 transition",
                    selected?._id === o._id ? "bg-[color:var(--color-background-light)]" : "bg-white",
                  ].join(" ")}
                  title="Open order"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-bold break-all">{o._id}</div>
                      <div className="text-xs opacity-70 mt-1">
                        {fmtDate(o.createdAt)} • {o.email || "—"}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <StatusChip status={o.status} />
                      <span className="text-xs font-bold">{centsToEUR(o.totalCents)}</span>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* DETAIL */}
        <div className="lg:col-span-7 ui-card">
          <div className="ui-bar bg-[color:var(--color-retro-yellow)]">
            <span className="ui-label text-sm md:text-base">Order.detail</span>
            {selected?.status ? <StatusChip status={selected.status} /> : null}
          </div>

          <div className="p-4 space-y-3">
            {!selected ? (
              <p className="text-sm opacity-70">Seleziona un ordine dalla lista.</p>
            ) : (
              <>
                <div className="ui-panel text-sm space-y-1">
                  <div className="break-all">
                    <span className="opacity-70">ID:</span>{" "}
                    <span className="font-bold">{selected._id}</span>
                  </div>
                  <div>
                    <span className="opacity-70">Created:</span>{" "}
                    <span className="font-bold">{fmtDate(selected.createdAt)}</span>
                  </div>
                  <div>
                    <span className="opacity-70">Email:</span>{" "}
                    <span className="font-bold">{selected.email || "—"}</span>
                  </div>
                  <div>
                    <span className="opacity-70">Total:</span>{" "}
                    <span className="font-bold">{centsToEUR(selected.totalCents)}</span>
                  </div>
                  {selected.stripePaymentIntentId ? (
                    <div className="break-all">
                      <span className="opacity-70">PI:</span>{" "}
                      <span className="font-[var(--font-mono)]">{selected.stripePaymentIntentId}</span>
                    </div>
                  ) : null}
                </div>

                <div className="ui-panel ui-panel-soft">
                  <div className="flex flex-col md:flex-row md:items-end gap-2">
                    <div className="flex-1">
                      <span className="ui-label block mb-1">Update_Status</span>
                      <select
                        className="ui-input w-full h-11"
                        value={selected.status}
                        onChange={(e) => setSelected((s) => ({ ...s, status: e.target.value }))}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button className="ui-btn h-11" onClick={saveStatus} disabled={busy}>
                      Save
                    </button>
                  </div>
                </div>

                <div className="ui-card-sm">
                  <div className="ui-bar bg-[#93D5B3]">
                    <span className="ui-label">Items</span>
                    <span className="text-xs opacity-70">{(selected.items || []).length}</span>
                  </div>

                  <div className="p-3 space-y-2 text-sm">
                    {(selected.items || []).map((it, idx) => (
                      <div key={`${it.baseName}_${it.productKey}_${idx}`} className="ui-panel ui-panel-soft">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="font-bold">{it.productLabel || it.productKey}</div>
                            <div className="text-xs opacity-70">
                              {it.title || it.baseName} • x{it.qty}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">{centsToEUR(it.lineTotalCents)}</div>
                            <div className="text-xs opacity-70">{centsToEUR(it.unitPriceCents)} / unit</div>
                          </div>
                        </div>
                        {it.mockupUrl ? (
                          <div className="text-xs opacity-70 break-all mt-2">mockup: {it.mockupUrl}</div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}