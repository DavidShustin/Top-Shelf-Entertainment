import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Music2, Headphones } from "lucide-react";

const DJTeam = () => {
  const djs = [
    {
      name: "DJ Gibbz",
      specialty: "Wedding Specialist",
      experience: "10+ Years",
      description: "Expert in creating romantic atmospheres and seamless transitions for your special day",
      skills: ["Classical", "Pop", "R&B", "Jazz"]
    },
    {
      name: "DJ Sarah",
      specialty: "Party & Events",
      experience: "8+ Years",
      description: "High-energy entertainment perfect for birthdays, corporate events, and celebrations",
      skills: ["Hip-Hop", "Electronic", "Top 40", "Latin"]
    },
    {
      name: "DJ Alex",
      specialty: "Bar/Bat Mitzvah Expert",
      experience: "12+ Years",
      description: "Specializes in age-appropriate entertainment and traditional celebration music",
      skills: ["Traditional", "Modern", "Interactive", "Family-Friendly"]
    },
    {
      name: "DJ Chris",
      specialty: "Multi-Genre Master",
      experience: "15+ Years",
      description: "Versatile DJ who can adapt to any crowd and musical preference",
      skills: ["Rock", "Country", "Reggae", "Oldies"]
    },
    {
      name: "DJ Jordan",
      specialty: "Electronic & EDM",
      experience: "7+ Years",
      description: "Specializes in electronic music and high-energy dance events",
      skills: ["EDM", "House", "Techno", "Dubstep"]
    },
    {
      name: "DJ Taylor",
      specialty: "Retro & Classics",
      experience: "9+ Years",
      description: "Master of vintage hits and nostalgic music from every decade",
      skills: ["80s", "90s", "Disco", "Classic Rock"]
    }
  ];

  return (
    <section className="py-16 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4">
          Meet Our DJ Team
        </h2>
        <p className="text-xl text-center text-gray-300 mb-12 max-w-3xl mx-auto">
          Our professional DJs bring years of experience and passion to every event
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {djs.map((dj, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors duration-300">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Headphones className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-white">{dj.name}</CardTitle>
                <CardDescription className="text-purple-300 font-semibold">
                  {dj.specialty}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center gap-1 mb-3">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-gray-300 text-sm">{dj.experience}</span>
                </div>
                <p className="text-gray-300 text-sm mb-4 text-center">
                  {dj.description}
                </p>
                <div className="flex flex-wrap gap-1 justify-center">
                  {dj.skills.map((skill, idx) => (
                    <Badge key={idx} variant="secondary" className="bg-purple-600 text-white text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DJTeam;