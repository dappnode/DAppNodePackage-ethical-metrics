import {
  Box,
  Card,
  Alert,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import React from "react";
import { getInstance } from "../../calls/getInstance";
import { registerInstance } from "../../calls/registerInstance";
import { unregisterInstance } from "../../calls/unregisterInstance";

export default function MainCard(): JSX.Element {
  const [instance, setInstance] = React.useState<string>("");
  const [fetchError, setFetchError] = React.useState<string | undefined>(
    undefined
  );
  const [successMessage, setSuccessMessage] = React.useState<
    string | undefined
  >(undefined);
  const [loading, setLoading] = React.useState<boolean>(false);

  // Get instance ID from API (/api/instance)
  async function getInstanceId(): Promise<void> {
    try {
      const instanceResponse = await getInstance();
      setInstance(instanceResponse.instance);
    } catch (err) {
      setFetchError(`Error fetching dappnode ID: ${err.message}`);
    }
  }

  async function triggerRegister(): Promise<void> {
    try {
      setLoading(true);
      const registerResponse = await registerInstance();
      setLoading(false);
      setSuccessMessage(registerResponse.message);
    } catch (err) {
      setFetchError(`Error registering: ${err.message}`);
    }
  }

  async function triggerUnregister(): Promise<void> {
    try {
      setLoading(true);
      const registerResponse = await unregisterInstance();
      setLoading(false);
      setSuccessMessage(registerResponse.message);
    } catch (err) {
      setFetchError(`Error unregistering: ${err.message}`);
    }
  }

  React.useEffect(() => {
    getInstanceId();
  }, []);

  return (
    <div>
      <Box
        sx={{
          margin: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Card
          sx={{
            padding: 4,
            borderRadius: 2,
            alignItems: "center",
            alignContent: "center",
            flexDirection: "column",
            display: "flex",
          }}
        >
          <TextField
            label="Dappnode ID"
            value={instance}
            InputProps={{
              readOnly: true,
            }}
            sx={{ width: "100%", marginTop: 2 }}
          />

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              marginTop: 2,
            }}
          >
            {loading ? (
              <CircularProgress />
            ) : (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ marginRight: 1 }}
                  onClick={() => triggerRegister()}
                >
                  Register
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  sx={{ marginLeft: 1 }}
                  onClick={() => triggerUnregister()}
                >
                  Unregister
                </Button>
              </>
            )}
          </Box>

          {successMessage && (
            <Alert severity="success" sx={{ marginTop: 2 }} variant="outlined">
              {successMessage}
            </Alert>
          )}

          {fetchError && (
            <Alert severity="error" sx={{ marginTop: 2 }} variant="outlined">
              {fetchError}
            </Alert>
          )}

          <Alert severity="info" sx={{ marginTop: 2 }} variant="outlined">
            While your dappnode is registered in Ethical Metrics, you will
            receive alerts if it goes offline or its CPU consumption is
            abnormally high.
          </Alert>

          {/*<UnregisterDialog
                  rows={validatorsGet}
                  selectedRows={selectedRows}
                  setSelectedRows={setSelectedRows}
                  open={deleteOpen}
                  setOpen={setDeleteOpen}
                />
            */}
        </Card>
      </Box>
    </div>
  );
}
