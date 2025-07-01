import Hero from './Hero';
import Services from './Services';
import DJTeam from './DJTeam';
import Motivators from './Motivators';
import Contact from './Contact';

const AppLayout = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Services />
      <DJTeam />
      <Motivators />
      <Contact />
    </div>
  );
};

export default AppLayout;