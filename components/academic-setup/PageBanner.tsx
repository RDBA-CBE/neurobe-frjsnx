interface PageBannerProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  imageUrl?: string;
}

const PageBanner = ({ title, description, icon, imageUrl }: PageBannerProps) => {
  return (
    <div className="relative mb-6  rounded-2xl bg-color1 px-8 py-7 mt-2">
      <div className="relative z-10 flex items-center gap-5">
        {icon && (
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white">
            {icon}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          <p className="mt-1 max-w-xl text-sm text-white/70">{description}</p>
        </div>
      </div>
      {imageUrl && (
        <img
          src={imageUrl}
          alt="banner"
          className="absolute -bottom-4 right-6 h-48"
        />
      )}
      {/* decorative circles */}
      <div className="absolute right-10 -top-10 h-48 w-48 rounded-full bg-white/5" />
      <div className="absolute -bottom-8 right-32 h-32 w-32 rounded-full bg-white/5" />
    </div>
  );
};

export default PageBanner;
