import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";

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
