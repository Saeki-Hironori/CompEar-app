import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import { format } from "path";

const freq = [
  20, 25, 32, 40, 50, 63, 79, 100, 126, 158, 200, 251, 316, 398, 501, 631, 794,
  1000, 1259, 1585, 1995, 2512, 3162, 3981, 5012, 6310, 7943, 10000, 12589,
  15849, 19953,
];

type Props = {
  id: number;
  maker: string;
  addedAt: Date | null;
  imageUrl: string;
  onClick: (id: number, maker: string) => void;
};

const ItemCard = (props: Props) => {
  const { id, maker, addedAt, imageUrl, onClick } = props;

  const date = addedAt?.toLocaleString();

  return (
    <Card>
      <CardActionArea onClick={() => onClick(id, maker)}>
        <CardMedia
          component="img"
          image={imageUrl}
          alt="ランダム"
          sx={{ height: "200px", width: "100%", objectFit: "cover" }}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {id}. {maker}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {`${date}`}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ItemCard;
