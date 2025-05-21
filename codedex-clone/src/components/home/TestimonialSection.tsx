import type React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

interface TestimonialCardProps {
  name: string;
  role: string;
  location: string;
  quote: string;
  profileImage: string;
  bgColor: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  name,
  role,
  location,
  quote,
  profileImage,
  bgColor,
}) => {
  return (
    <Card className={`${bgColor} rounded-lg overflow-hidden border-0`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-16 h-16 relative rounded-full overflow-hidden">
            <Image
              src={profileImage}
              alt={name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="font-pixel text-lg text-white mb-1">{name}</h3>
            <p className="text-white/80 text-sm">{quote}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 relative opacity-80">
              <Image
                src="https://ext.same-assets.com/1748103887/2116589346.svg"
                alt="Rol"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-white/70 text-xs">{role}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 relative opacity-80">
              <Image
                src="https://ext.same-assets.com/1748103887/1743763944.svg"
                alt="Ubicación"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-white/70 text-xs">{location}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const TestimonialSection = () => {
  const testimonials = [
    {
      name: "Moses",
      role: "Desarrollador de Software",
      location: "Brooklyn, NY",
      quote:
        "Codedex ayudó a revitalizar mi pasión por la programación después del Hackathon de Navidad. Desde entonces, me he conectado con personas que comparten intereses similares a los míos. Se siente como en casa.",
      profileImage: "https://ext.same-assets.com/1748103887/3158667705.svg",
      bgColor: "bg-indigo-700",
    },
    {
      name: "Evangelene",
      role: "Ingeniera Frontend",
      location: "Singapur",
      quote:
        "La comunidad de Codedex se siente como una reconfortante taza de té matcha caliente en un día lluvioso y frío. Es un espacio cálido y acogedor a pesar de nuestros diversos orígenes y comienzos.",
      profileImage: "https://ext.same-assets.com/1748103887/3363814926.svg",
      bgColor: "bg-green-700",
    },
  ];

  const stats = [
    { value: "81k+", label: "Estudiantes" },
    { value: "71", label: "Países" },
    { value: "1.9m+", label: "Ejercicios" },
    { value: "7k+", label: "Proyectos" },
  ];

  return (
    <section className="py-16 bg-codedex-darkNavy">
      <div className="codedex-container">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-px bg-codedex-gold/20 flex-grow" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {testimonials.map((testimonial) => (
            <TestimonialCard
              key={testimonial.name}
              name={testimonial.name}
              role={testimonial.role}
              location={testimonial.location}
              quote={testimonial.quote}
              profileImage={testimonial.profileImage}
              bgColor={testimonial.bgColor}
            />
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              <div className="text-4xl font-pixel text-codedex-gold mb-2">
                {stat.value}
              </div>
              <div className="text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
