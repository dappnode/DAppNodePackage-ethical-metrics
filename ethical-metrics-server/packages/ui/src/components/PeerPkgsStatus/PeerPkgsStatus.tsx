import React from "react";
import { Card, Box, Container, Typography } from "@mui/material";
import { PeerPkgs } from "./types";

export default function PeerPkgsStatus(): JSX.Element {
  const images: Map<PeerPkgs, string> = new Map([
    [PeerPkgs.DMS, "/assets/dms.png"],
    [PeerPkgs.EXPORTER, "/assets/exporter.png"],
  ]);

  return (
    //The container should fill all horizontal space
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        backgroundColor: "transparent",
      }}
    >
      <Card
        sx={{
          py: 1,
          px: 3,
          mt: 2,
          mb: -5,
          border: "none",
          boxShadow: "none",
          backgroundColor: "transparent",
          backgroundImage: "none",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-evenly",
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Card sx={{ borderRadius: 2 }}>
              <Box
                component="img"
                sx={{
                  height: 80,
                  width: 80,
                  padding: 1,
                }}
                alt="dms"
                src={images.get(PeerPkgs.DMS)}
              />
            </Card>
            <Typography sx={{ fontWeight: "bold", mt: 2 }}>
              {PeerPkgs.DMS}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Card sx={{ borderRadius: 2 }}>
              <Box
                component="img"
                sx={{
                  height: 80,
                  width: 80,
                  padding: 1,
                }}
                alt="exporter"
                src={images.get(PeerPkgs.EXPORTER)}
              />
            </Card>
            <Typography sx={{ fontWeight: "bold", mt: 2 }}>
                {PeerPkgs.EXPORTER}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
          </Box>
        </Box>
      </Card>
    </Container>
  );
}
