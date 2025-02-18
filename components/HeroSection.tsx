export default function HeroSection({
  title,
  subtitle,
  buttonText,
}: {
  title: string;
  subtitle: string;
  buttonText: string;
}) {
  return (
    <section className="bg-gradient-to-r from-blue-500 to-purple-500 text-white py-20 w-full">
      <div className="container mx-auto text-center px-4">
        <h1 className="text-4xl font-bold mb-4">{title}</h1>
        <p className="text-lg mb-8">{subtitle}</p>
        <button className="bg-white text-blue-600 px-6 py-2 rounded-full font-semibold">
          {buttonText}
        </button>
      </div>
    </section>
  );
}