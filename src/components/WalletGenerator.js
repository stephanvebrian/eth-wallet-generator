import { useState, useEffect } from "react";
import { filter } from "lodash";
import { sentenceCase } from "change-case";
import { useLocalStorage } from "@rehooks/local-storage";
import { ethers } from "ethers";
// import { Link as RouterLink } from "react-router-dom";

// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Box,
  Modal,
  Input,
  TextField,
} from "@mui/material";
// components
import Page from "./Page";
import Label from "./Label";
import Scrollbar from "./Scrollbar";
import Iconify from "./Iconify";
import SearchNotFound from "./SearchNotFound";

import WalletListHead from "./WalletListHead";
import WalletListToolbar from "./WalletListToolbar";
import WalletMoreMenu from "./WalletMoreMenu";
//
// import USERLIST from "../_mocks/user";
const USERLIST = [];

// ----------------------------------------------------------------------

// const TABLE_HEAD = [
//   { id: "name", label: "Name", alignRight: false },
//   { id: "company", label: "Company", alignRight: false },
//   { id: "role", label: "Role", alignRight: false },
//   { id: "isVerified", label: "Verified", alignRight: false },
//   { id: "status", label: "Status", alignRight: false },
//   { id: "" },
// ];

const TABLE_HEAD = [
  { id: "name", label: "Name", alignRight: false },
  { id: "address", label: "Address", alignRight: false },
  { id: "etherAmount", label: "Ether Amount", alignRight: false },
  { id: "" },
];

const STORAGE_KEY = "ETH_WALLET_LIST";
const STORAGE_INITIAL_VALUE = localStorage.getItem(STORAGE_KEY) ?? [];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(
      array,
      (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function WalletGenerator() {
  const [walletList, setWalletList, deleteWalletList] = useLocalStorage(
    STORAGE_KEY,
    STORAGE_INITIAL_VALUE
  );

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("name");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [addWalletOpened, setAddWalletOpened] = useState(false);

  const [modalNameInput, setModalNameInput] = useState("");
  const [modalAddressInput, setModalAddressInput] = useState("");
  const [modalPrivateKey, setModalPrivateKey] = useState("");
  const [modalMnemonicPhrase, setModalMnemonicPhrase] = useState("");

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = USERLIST.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const handleGenerateWallet = (event) => {
    const generatedWallet = ethers.Wallet.createRandom();

    const newWalletList = [
      ...walletList,
      {
        Name: `New Wallet ${walletList.length}`,
        Address: generatedWallet.address,
        PrivateKey: generatedWallet.privateKey,
        MnemonicPhrase: generatedWallet.mnemonic,
      },
    ];
    setWalletList(newWalletList);
  };

  const handleAddNewWallet = (event) => {
    setAddWalletOpened(true);
    console.log("ADD NEW WALLET");
  };

  const handleAddWalletModalClose = (event) => {
    setAddWalletOpened(false);
  };

  // Add new wallet modal
  const handleModalName = (event) => {
    setModalNameInput(event.target.value);
  };

  const handleModalWalletAddress = (event) => {
    setModalAddressInput(event.target.value);
  };

  const handleModalWalletPrivateKey = (event) => {
    setModalPrivateKey(event.target.value);
  };

  const handleModalMnemonicPhrase = (event) => {
    setModalMnemonicPhrase(event.target.value);
  };

  const handleModalAddWallet = () => {
    const newWalletList = [
      ...walletList,
      {
        Name: modalNameInput,
        Address: modalAddressInput,
        PrivateKey: modalPrivateKey,
        MnemonicPhrase: modalMnemonicPhrase,
      },
    ];
    setWalletList(newWalletList);
    setModalNameInput("");
    setModalAddressInput("");
    setModalPrivateKey("");
    setModalMnemonicPhrase("");
    setAddWalletOpened(false);
  };
  // end of new wallet modal

  const handleDeleteRow = (address) => {
    console.log(`DELETING ${address}`);
    const newWalletList = [...walletList].filter((val, idx) => val.Address !== address);
    setWalletList(newWalletList);
  }

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredWalletList = applySortFilter(
    walletList,
    getComparator(order, orderBy),
    filterName
  );

  const isWalletNotFound = filteredWalletList.length === 0;

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

  return (
    <Page title="Ethereum Wallet Generator">
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Wallets
          </Typography>
          <Box display="flex" gap="1rem">
            <Button
              variant="contained"
              // component={RouterLink}
              // to="#"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={handleGenerateWallet}
            >
              Generate Wallet
            </Button>
            <Button
              variant="contained"
              // component={RouterLink}
              // to="#"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={handleAddNewWallet}
            >
              New Wallet
            </Button>
          </Box>
        </Stack>

        <Modal
          open={addWalletOpened}
          onClose={handleAddWalletModalClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={modalStyle}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Add new wallet
            </Typography>
            <Typography
              component={"span"}
              id="modal-modal-description"
              sx={{ mt: 2 }}
            >
              <Box style={{ marginBottom: ".85rem" }}>
                <Input
                  onChange={handleModalName}
                  value={modalNameInput}
                  multiline
                  placeholder="Name"
                  inputProps={{ "aria-label": "description" }}
                  style={{ minWidth: "500px" }}
                />
              </Box>
              <Box style={{ marginBottom: ".85rem" }}>
                <Input
                  onChange={handleModalWalletAddress}
                  value={modalAddressInput}
                  multiline
                  placeholder="Wallet Address"
                  inputProps={{ "aria-label": "description" }}
                  style={{ minWidth: "500px" }}
                />
              </Box>
              <Box style={{ marginBottom: ".85rem" }}>
                <TextField
                  id="wallet-private-key"
                  value={modalPrivateKey}
                  onChange={handleModalWalletPrivateKey}
                  placeholder="Wallet Private Key"
                  multiline
                  rows={2}
                  variant="standard"
                  style={{ minWidth: "500px" }}
                />
              </Box>
              <Box style={{ marginBottom: ".85rem" }}>
                <TextField
                  id="wallet-mnemonic-phrase"
                  value={modalMnemonicPhrase}
                  onChange={handleModalMnemonicPhrase}
                  placeholder="Wallet Mnemonic Phrase"
                  multiline
                  rows={4}
                  variant="standard"
                  style={{ minWidth: "500px" }}
                />
              </Box>
              <Box style={{ textAlign: "right" }}>
                <Button onClick={handleModalAddWallet} variant="contained">
                  Add Wallet
                </Button>
              </Box>
            </Typography>
          </Box>
        </Modal>

        <Card>
          <WalletListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <WalletListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={walletList.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredWalletList
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const { Name, Address, PrivateKey, MnemonicPhrase } = row;
                      const isItemSelected = selected.indexOf(Address) !== -1;

                      return (
                        <TableRow
                          hover
                          key={Address}
                          tabIndex={-1}
                          role="checkbox"
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isItemSelected}
                              onChange={(event) => handleClick(event, Name)}
                            />
                          </TableCell>
                          <TableCell component="th" scope="row" padding="none">
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={2}
                            >
                              <Typography variant="subtitle2" noWrap>
                                {Name}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="left">{Address}</TableCell>
                          <TableCell align="left">TBA</TableCell>

                          <TableCell align="right">
                            <WalletMoreMenu onDelete={handleDeleteRow.bind(null, Address)} />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                {isWalletNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={walletList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}
