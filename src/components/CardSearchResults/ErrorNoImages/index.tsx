export function ErrorNoImages() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-slate-800 text-slate-600">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-10 w-10 mb-2 opacity-30"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
      <span className="text-[10px] font-bold uppercase tracking-widest leading-tight text-center">
        Sem Imagem
      </span>
    </div>
  );
}
