import PropTypes from "prop-types";
import {
  Button,
  Typography,
  Box,
  Modal,
  Input,
  TextField,
} from "@mui/material";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  // width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const WalletModalForm = (props) => {
  const isDisabledForm = props.modalType === "DETAIL_MODAL";
  // const isDisabledForm = false;

  return (
    <Modal
      open={props.isModalOpen}
      onClose={props.onClosedModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyle}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {/* Add new wallet */}
          {props.modalTitle}
        </Typography>
        <Typography
          component={"span"}
          id="modal-modal-description"
          sx={{ mt: 2 }}
        >
          <Box style={{ marginBottom: ".85rem" }}>
            <Input
              onChange={props.onChangeWalletName}
              value={props.valueWalletName}
              multiline
              placeholder="Name"
              inputProps={{ "aria-label": "description" }}
              style={{ minWidth: "500px" }}
              disabled={isDisabledForm}
            />
          </Box>
          <Box style={{ marginBottom: ".85rem" }}>
            <Input
              onChange={props.onChangeWalletAddress}
              value={props.valueWalletAddress}
              multiline
              placeholder="Wallet Address"
              inputProps={{ "aria-label": "description" }}
              style={{ minWidth: "500px" }}
              disabled={isDisabledForm}
            />
          </Box>
          <Box style={{ marginBottom: ".85rem" }}>
            <TextField
              id="wallet-private-key"
              onChange={props.onChangeWalletPrivateKey}
              value={props.valueWalletPrivateKey}
              placeholder="Wallet Private Key"
              multiline
              rows={2}
              variant="standard"
              style={{ minWidth: "500px" }}
              disabled={isDisabledForm}
            />
          </Box>
          <Box style={{ marginBottom: ".85rem" }}>
            <TextField
              id="wallet-mnemonic-phrase"
              onChange={props.onChangeWalletMnemonicPhrase}
              value={props.valueWalletMnemonicPhrase}
              placeholder="Wallet Mnemonic Phrase"
              multiline
              rows={4}
              variant="standard"
              style={{ minWidth: "500px" }}
              disabled={isDisabledForm}
            />
          </Box>
          {!isDisabledForm && (
            <Box style={{ textAlign: "right" }}>
              <Button onClick={props.onClickSubmit} variant="contained">
                {props.modalTitle}
              </Button>
            </Box>
          )}
        </Typography>
      </Box>
    </Modal>
  );
};

WalletModalForm.propTypes = {
  isModalOpen: PropTypes.bool,
  modalType: PropTypes.string,
  onClosedModal: PropTypes.func,
  modalTitle: PropTypes.string,
  onChangeWalletName: PropTypes.func,
  valueWalletName: PropTypes.string,
  onChangeWalletAddress: PropTypes.func,
  valueWalletAddress: PropTypes.string,
  onChangeWalletPrivateKey: PropTypes.func,
  valueWalletPrivateKey: PropTypes.string,
  onChangeWalletMnemonicPhrase: PropTypes.func,
  valueWalletMnemonicPhrase: PropTypes.string,
  onClickSubmit: PropTypes.func,
};

export default WalletModalForm;
