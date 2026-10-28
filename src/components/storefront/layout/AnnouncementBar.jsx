export default function AnnouncementBar() {
  return (
    <div className="bg-[#ece2ce] text-neutral-900 text-[11px] font-medium py-2 px-4 border-b border-[#d4af37]/45">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <span className="hidden md:inline-block tracking-[0.22em] uppercase text-[#7a5a18] font-semibold">
          ✦ 100% Certified Authentic
        </span>
        <span className="mx-auto md:mx-0 tracking-[0.22em] uppercase font-semibold text-neutral-900">
          Complimentary Insured Express Delivery on Curated Orders
        </span>
        <span className="hidden md:inline-block tracking-[0.22em] uppercase text-[#7a5a18] font-semibold">
          Paris • Milan • Geneva ✦
        </span>
      </div>
    </div>
  );
}
