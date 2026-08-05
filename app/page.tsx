import CorporateImage from '../ui/CorporateImage';

const HomePage: NextPage = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-white/10 backdrop-blur-sm">
      <CorporateImage src="https://source.unsplash.com/800x600/?corporate,office,technology" />
    </div>
  );
};

export default HomePage;