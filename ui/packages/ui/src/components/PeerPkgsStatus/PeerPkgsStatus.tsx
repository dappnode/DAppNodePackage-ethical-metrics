import React from "react";
import {
  Card,
  Box,
  Container,
  Typography,
  Badge,
  Tooltip,
} from "@mui/material";
import { PeerPkgs } from "@ethical-metrics/common";
import { isPackageHealthy } from "../../calls/isServiceHealthy";

export default function PeerPkgsStatus(): JSX.Element {
  const images: Map<PeerPkgs, string> = new Map([
    [PeerPkgs.DMS, "/assets/dms.png"],
    [PeerPkgs.EXPORTER, "/assets/exporter.png"],
  ]);

  const [isDmsHealthy, setIsDmsHealthy] = React.useState<boolean>(false);
  const [isExporterHealthy, setIsExporterHealthy] =
    React.useState<boolean>(false);

  React.useEffect(() => {
    const checkPackageHealth = async () => {
      setIsDmsHealthy(await isPackageHealthy(PeerPkgs.DMS));
      setIsExporterHealthy(await isPackageHealthy(PeerPkgs.EXPORTER));
    };

    checkPackageHealth(); // execute on mount

    const interval = setInterval(checkPackageHealth, 30000); // execute every 30 seconds
    return () => clearInterval(interval);
  }, []);

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
            <Card sx={{ borderRadius: 2, position: "relative" }}>
              <Tooltip
                title={
                  isDmsHealthy
                    ? "DMS is online"
                    : "DMS is not reachable. Make sure it is installed and running"
                }
              >
                <Badge
                  sx={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    backgroundColor: isDmsHealthy ? "green" : "red",
                    color: "white",
                    fontWeight: "bold",
                    borderRadius: "50%",
                    padding: "8px",
                    fontSize: 12,
                  }}
                ></Badge>
              </Tooltip>
              <Box
                component="img"
                sx={{
                  height: 80,
                  width: 80,
                  padding: 2,
                  mb: -1,
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
            <Card sx={{ borderRadius: 2, position: "relative" }}>
              <Tooltip
                title={
                  isDmsHealthy
                    ? "Exporter is online"
                    : "Exporter is not reachable. Make sure it is installed and running"
                }
              >
                <Badge
                  sx={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    backgroundColor: isExporterHealthy ? "green" : "red",
                    color: "white",
                    fontWeight: "bold",
                    borderRadius: "50%",
                    padding: "8px",
                    fontSize: 12,
                  }}
                ></Badge>
              </Tooltip>
              <Box
                component="img"
                sx={{
                  height: 80,
                  width: 80,
                  padding: 2,
                  mb: -1,
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
          ></Box>
        </Box>
      </Card>
    </Container>
  );
}
