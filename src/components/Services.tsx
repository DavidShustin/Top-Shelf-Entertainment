import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, Heart, PartyPopper, Cake } from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: <Heart className="h-12 w-12 text-pink-500" />,
      title: "Weddings",
      description: "Make your special day unforgettable with romantic music and seamless transitions",
      specialties: ["First Dance", "Ceremony Music", "Reception Entertainment"]
    },
    {
      icon: <PartyPopper className="h-12 w-12 text-purple-500" />,
      title: "Bar/Bat Mitzvahs",
      description: "Celebrate this milestone with age-appropriate music and interactive entertainment",
      specialties: ["Traditional Music", "Modern Hits", "Interactive Games"]
    },
    {
      icon: <Cake className="h-12 w-12 text-orange-500" />,
      title: "Birthday Parties",
      description: "From kids to adults, we bring the perfect energy to any birthday celebration",
      specialties: ["All Ages", "Theme Parties", "Interactive Entertainment"]
    },
    {
      icon: <Music className="h-12 w-12 text-blue-500" />,
      title: "Corporate Events",
      description: "Professional entertainment for corporate gatherings and special events",
      specialties: ["Background Music", "Announcements", "Award Ceremonies"]
    }
  ];

  return (
    <section id="services" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4 text-gray-800">
          Top Shelf Entertainment Services
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Professional DJ services for all occasions. Contact us to discuss pricing and customize your event experience.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-2 hover:border-purple-300">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  {service.icon}
                </div>
                <CardTitle className="text-xl">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center mb-4">
                  {service.description}
                </CardDescription>
                <ul className="text-sm text-gray-600 space-y-1">
                  {service.specialties.map((specialty, idx) => (
                    <li key={idx} className="flex items-center">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                      {specialty}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;