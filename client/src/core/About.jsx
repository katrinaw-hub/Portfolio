// Static "About Me" page with photo + resume link.

import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Link,
} from "@mui/material";
import meImg from "../assets/me.png";
import resumePdf from "../assets/resume.pdf";

const About = () => (
  <Box sx={{ display: "flex", justifyContent: "center", mt: 4, px: 2 }}>
    <Card
      sx={{
        maxWidth: 900,
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        p: 2,
      }}
    >
      {/* Profile image */}
      <CardMedia
        component="img"
        image={meImg}
        alt="Portrait of Katrina Wong"
        sx={{
          width: { xs: "100%", md: 260 },
          borderRadius: 2,
          objectFit: "cover",
          mr: { md: 2 },
          mb: { xs: 2, md: 0 },
        }}
      />
      {/* Text content */}
      <CardContent>
        <Typography
          variant="h4"
          sx={{ color: "primary.main", mb: 1, fontWeight: 700 }}
        >
          Hung Sheung Wong
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          You can call me Katrina ^ ^.
        </Typography>
        <Typography sx={{ mb: 3 }}>
          I’m an AI student who is learning web application development. I enjoy
          programming and experimenting with the MERN stack, especially how AI
          tools can help with productivity while staying responsible and secure.
        </Typography>
        <Typography sx={{ mb: 3 }}>
          This portfolio showcases a few sample projects that span frontend UI,
          backend APIs, and full-stack MERN applications.
        </Typography>
        <Button
          component={Link}
          href={resumePdf}
          target="_blank"
          rel="noopener"
          variant="outlined"
        >
          View my resume (PDF)
        </Button>
      </CardContent>
    </Card>
  </Box>
);

export default About;