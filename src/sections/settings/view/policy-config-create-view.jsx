import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Grid, Box, Card } from '@mui/material';
import { useGetConfigs } from 'src/api/config';
import axios from 'axios';
import { useAuthContext } from 'src/auth/hooks';
import { useSnackbar } from 'src/components/snackbar';
import Iconify from 'src/components/iconify';
import { Stack } from '@mui/system';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export default function PolicyConfigCreateView() {
  const { user } = useAuthContext();
  const { configs, mutate } = useGetConfigs();
  const [exportPolicyConfig, setExportPolicyConfig] = useState('');
  const [localPolicyConfig, setLocalPolicyConfig] = useState(configs?.exportPolicyConfig || []);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingValue, setEditingValue] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (configs?.exportPolicyConfig) {
      setLocalPolicyConfig(configs.exportPolicyConfig);
    }
  }, [configs]);

  const handleRemarkClick = () => {
    if (!exportPolicyConfig.trim()) {
      enqueueSnackbar('Terms And Conditions cannot be empty', { variant: 'warning' });
      return;
    }

    const URL = `${import.meta.env.VITE_BASE_URL}/${user?.company}/config/${configs?._id}`;
    const updatedConfig = [...localPolicyConfig, exportPolicyConfig.trim()];
    setLocalPolicyConfig(updatedConfig);

    axios
      .put(URL, { ...configs, exportPolicyConfig: updatedConfig })
      .then(() => {
        setExportPolicyConfig('');
        enqueueSnackbar('Terms And Conditions added successfully', { variant: 'success' });
        mutate();
      })
      .catch(() => {
        enqueueSnackbar('Failed to add Terms And Conditions', { variant: 'error' });
        setLocalPolicyConfig(localPolicyConfig);
      });
  };

  const handleDeleteRemark = (item) => {
    const updatedConfig = localPolicyConfig.filter((r) => r !== item);
    setLocalPolicyConfig(updatedConfig);
    const apiEndpoint = `${import.meta.env.VITE_BASE_URL}/${user?.company}/config/${configs?._id}`;

    axios
      .put(apiEndpoint, { ...configs, exportPolicyConfig: updatedConfig })
      .then(() => {
        enqueueSnackbar('Terms and Conditions deleted successfully', { variant: 'success' });
        mutate();
      })
      .catch(() => {
        enqueueSnackbar('Failed to delete Terms and Conditions', { variant: 'error' });
        setLocalPolicyConfig(localPolicyConfig);
      });
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedList = Array.from(localPolicyConfig);
    const [movedItem] = reorderedList.splice(result.source.index, 1);
    reorderedList.splice(result.destination.index, 0, movedItem);

    setLocalPolicyConfig(reorderedList);

    const apiEndpoint = `${import.meta.env.VITE_BASE_URL}/${user?.company}/config/${configs?._id}`;
    axios
      .put(apiEndpoint, { ...configs, exportPolicyConfig: reorderedList })
      .then(() => {
        mutate();
      })
      .catch(() => {
        enqueueSnackbar('Failed to update order', { variant: 'error' });
        setLocalPolicyConfig(localPolicyConfig);
      });
  };

  const handleEditClick = (index, value) => {
    setEditingIndex(index);
    setEditingValue(value);
  };

  const handleEditSave = () => {
    if (!editingValue.trim()) {
      enqueueSnackbar('Terms And Conditions cannot be empty', { variant: 'warning' });
      return;
    }

    const updatedConfig = [...localPolicyConfig];
    updatedConfig[editingIndex] = editingValue.trim();
    setLocalPolicyConfig(updatedConfig);

    const apiEndpoint = `${import.meta.env.VITE_BASE_URL}/${user?.company}/config/${configs?._id}`;
    axios
      .put(apiEndpoint, { ...configs, exportPolicyConfig: updatedConfig })
      .then(() => {
        enqueueSnackbar('Terms And Conditions updated successfully', { variant: 'success' });
        setEditingIndex(null);
        setEditingValue('');
        mutate();
      })
      .catch(() => {
        enqueueSnackbar('Failed to update Terms And Conditions', { variant: 'error' });
        setLocalPolicyConfig(localPolicyConfig);
      });
  };

  return (
    <Box sx={{ width: '100%', padding: '10px' }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Terms And Conditions
          </Typography>
        </Grid>
        <Grid item md={4} xs={12}>
          <Box sx={{ width: '100%', maxWidth: '600px', padding: '10px' }}>
            <TextField
              fullWidth
              variant="outlined"
              label="Terms And Conditions"
              value={exportPolicyConfig}
              onChange={(e) => setExportPolicyConfig(e.target.value)}
              sx={{ fontSize: '16px' }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: '20px' }}>
              <Button variant="contained" onClick={handleRemarkClick}>
                Add
              </Button>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="exportPolicyConfig">
                {(provided) => (
                  <Stack
                    spacing={2}
                    sx={{ p: 3 }}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {localPolicyConfig.map((item, index) => (
                      <Draggable key={item} draggableId={item} index={index}>
                        {(provided) => (
                          <Box
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              width: '100%',
                              boxShadow: 2,
                              borderRadius: 1,
                              p: 2,
                              backgroundColor: 'background.paper',
                              transition: 'background-color 0.3s',
                              '&:hover': { backgroundColor: 'grey.100' },
                            }}
                          >
                            <Box sx={{ width: '90%' }}>
                              {editingIndex === index ? (
                                <TextField
                                  value={editingValue}
                                  onChange={(e) => setEditingValue(e.target.value)}
                                  size="small"
                                  sx={{
                                    width: '95%',
                                  }}
                                  multiline
                                />
                              ) : (
                                <Typography
                                  sx={{
                                    fontSize: '14px',
                                    wordWrap: 'break-word',
                                    whiteSpace: 'pre-wrap',
                                    overflowWrap: 'break-word',
                                    width: '100%',
                                  }}
                                >
                                  {item}
                                </Typography>
                              )}
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              {editingIndex === index ? (
                                <Button variant="contained" size="small" onClick={handleEditSave}>
                                  Save
                                </Button>
                              ) : (
                                <Box
                                  sx={{ color: 'primary.main', cursor: 'pointer' }}
                                  onClick={() => handleEditClick(index, item)}
                                >
                                  <Iconify icon="eva:edit-fill" />
                                </Box>
                              )}
                              <Box
                                sx={{ color: 'error.main', cursor: 'pointer' }}
                                onClick={() => handleDeleteRemark(item)}
                              >
                                <Iconify icon="solar:trash-bin-trash-bold" />
                              </Box>
                            </Box>
                          </Box>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Stack>
                )}
              </Droppable>
            </DragDropContext>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
