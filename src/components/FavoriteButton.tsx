import { IWeatherData } from "@/api/types";
import { useFavorite } from "@/hooks/use-favorite";
import { Button } from "./ui/button";
import { Star } from "lucide-react";
import { toast } from "sonner";

interface IFavoriteButtonProps {
  data: IWeatherData;
}
const FavoriteButton = ({ data }: IFavoriteButtonProps) => {
  const { addFavorite, isFavorite, removeFavorites } = useFavorite();
  const isCurrentlyFavorite = isFavorite(data.coord.lat, data.coord.lon);
  const handleToggleFavorite = () => {
    if (isCurrentlyFavorite) {
      removeFavorites.mutate(`${data.coord.lat}-${data.coord.lon}`);
      toast.error(`Removed ${data.name} from favorites`);
    } else {
      addFavorite.mutate({
        name: data.name,
        lat: data.coord.lat,
        lon: data.coord.lon,
        country: data.sys.country,
      });
      toast.success(`Added ${data.name} to favorites`);
    }
  };

  return (
    <Button
      variant={`${isCurrentlyFavorite ? "default" : "outline"}`}
      size={"icon"}
      className={`${
        isCurrentlyFavorite ? "bg-yellow-500 hover:bg-yellow-600" : ""
      }`}
      onClick={handleToggleFavorite}
    >
      <Star
        className={` h-4 w-4 ${isCurrentlyFavorite ? "fill-current" : ""}`}
      />
    </Button>
  );
};

export default FavoriteButton;
