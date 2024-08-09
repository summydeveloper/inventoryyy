 
'use client'
import Image from "next/image";
import { firestore } from "@/firebase";
import { useState, useEffect } from 'react';
import { Box, Modal, Typography, Stack, TextField, Button, IconButton } from "@mui/material"
import { collection, deleteDoc, getDocs, query, setDoc, doc, getDoc } from "firebase/firestore";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import InventoryIcon from '@mui/icons-material/Inventory';
import { blue, green, grey } from "@mui/material/colors";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data()
      });
    });
    setInventory(inventoryList);
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    updateInventory();
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Filter inventory based on the search term
  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      gap={3}
      bgcolor={grey[100]}
      p={3}
    >
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          borderRadius={3}
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={2}
          sx={{ transform: "translate(-50%, -50%)" }}
        >
          <Typography variant="h6" color="primary" fontWeight="bold">
            Add New Item
          </Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              label="Item Name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose();
              }}
              startIcon={<AddIcon />}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <TextField
        variant="outlined"
        fullWidth
        placeholder="Search items..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{
          maxWidth: '800px',
          marginBottom: 2
        }}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleOpen}
        startIcon={<AddIcon />}
        sx={{
          fontWeight: 'bold',
          textTransform: 'none',
        }}
      >
        Add New Item
      </Button>

      <Box
        width="90%"
        maxWidth="800px"
        borderRadius={2}
        boxShadow={4}
        overflow="hidden"
      >
        <Box
          bgcolor={blue[700]}
          color="white"
          display="flex"
          alignItems="center"
          justifyContent="center"
          padding={2}
        >
          <Typography variant="h4" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
            <InventoryIcon sx={{ marginRight: 1 }} />
            Inventory
          </Typography>
        </Box>

        <Stack
          bgcolor="white"
          spacing={2}
          padding={3}
          maxHeight="300px"
          overflow="auto"
        >
          {
            filteredInventory.map(({ name, quantity }) => (
              <Box key={name}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                padding={2}
                bgcolor={green[50]}
                borderRadius={2}
                boxShadow={2}
              >
                <Typography variant="h6" color={grey[800]} fontWeight="bold">
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant="h6" color={grey[800]} fontWeight="bold">
                  {quantity}
                </Typography>
                <IconButton color="secondary" onClick={() => removeItem(name)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))
          }
        </Stack>
      </Box>
    </Box>
  );
}
