import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-pulse">
          TOP SHELF ENTERTAINMENT
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
          Professional DJs for Weddings, Parties, Bar/Bat Mitzvahs & More
        </p>
        <div className="flex justify-center gap-4">
          <Button 
            size="lg" 
            className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-4"
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Book Now
          </Button>
          <Link to="/booking">
            <Button 
              size="lg" 
              className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-4"
            >
              Schedule Call
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;