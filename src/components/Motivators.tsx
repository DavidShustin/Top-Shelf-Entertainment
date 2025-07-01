import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, Users, Zap, Trophy } from "lucide-react";

const Motivators = () => {
  const motivators = [
    {
      icon: <Mic className="h-8 w-8 text-red-500" />,
      name: "MC Services",
      description: "Professional master of ceremonies to keep your event flowing smoothly",
      features: ["Event Coordination", "Announcements", "Crowd Engagement"]
    },
    {
      icon: <Users className="h-8 w-8 text-blue-500" />,
      name: "Interactive Entertainment",
      description: "Get your guests involved with games, contests, and interactive activities",
      features: ["Dance Contests", "Trivia Games", "Karaoke"]
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-500" />,
      name: "Lighting Effects",
      description: "Transform your venue with professional lighting and visual effects",
      features: ["LED Uplighting", "Dance Floor Lighting", "Ambient Lighting"]
    },
    {
      icon: <Trophy className="h-8 w-8 text-green-500" />,
      name: "Special Requests",
      description: "Custom entertainment options tailored to your specific event needs",
      features: ["Live Mixing", "Special Dedications", "Custom Playlists"]
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4 text-gray-800">
          Motivator Options
        </h2>
        <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
          Enhance your event with our professional motivator services. 
          Discuss these options with our owner during consultation.
        </p>
        <div className="grid md:grid-cols-2 gap-8">
          {motivators.map((motivator, index) => (
            <Card key={index} className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-purple-500">
              <CardHeader>
                <div className="flex items-center gap-3">
                  {motivator.icon}
                  <CardTitle className="text-xl">{motivator.name}</CardTitle>
                </div>
                <CardDescription className="text-base">
                  {motivator.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {motivator.features.map((feature, idx) => (
                    <Badge key={idx} variant="secondary" className="bg-purple-100 text-purple-700">
                      {feature}
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

export default Motivators;