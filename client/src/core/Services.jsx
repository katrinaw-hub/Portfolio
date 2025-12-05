// Simple services grid with a hero image and three cards.

import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import serviceImg from "../assets/service.png";

// Static list is defined outside the component to avoid re-creating it on each render
const SERVICES = [
  {
    id: "s1",
    title: "Web Development",
    desc: "Node.js, Express REST APIs & MongoDB",
  },
  {
    id: "s2",
    title: "UX Engineering",
    desc: "Accessible, responsive interfaces",
  },
  {
    id: "s3",
    title: "Mobile Apps",
    desc: "React Native prototypes & apps",
  },
];

const Services = () => (
  <Box sx={{ mt: 4, px: 2 }}>
    <Typography
      variant="h4"
      sx={{ mb: 2, textAlign: "center", color: "primary.main" }}
    >
      Services
    </Typography>

    {/* Header image */}
    <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
      <CardMedia
        component="img"
        image={serviceImg}
        alt="Illustration of web services"
        sx={{ maxWidth: 400 }}
      />
    </Box>

    {/* Service cards */}
    <Grid container spacing={3} sx={{ maxWidth: 900, mx: "auto" }}>
      {SERVICES.map((service) => (
        <Grid item xs={12} md={4} key={service.id}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1 }}>
                {service.title}
              </Typography>
              <Typography variant="body2">{service.desc}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Box>
);

export default Services;