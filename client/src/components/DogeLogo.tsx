import logo from "../../../attached_assets/st,extra_large,507x507-pad,600x600,f8f8f8.png";

export default function DogeLogo() {
  return (
    <div className="w-full bg-[#2A2A2A] py-8">
      <div className="max-w-7xl mx-auto flex items-center justify-center">
        <img
          src={logo}
          alt="DOGE Government Efficiency Logo"
          className="h-32 w-auto object-contain"
        />
      </div>
    </div>
  );
}