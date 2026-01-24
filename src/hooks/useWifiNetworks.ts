import { useState, useEffect } from 'react'
import { storage } from '../lib/storage'
import { encryptPassword, decryptPassword } from '../lib/encryption'
import toast from 'react-hot-toast'

export interface WifiNetwork {
  id: string
  network_name: string
  password: string
  location?: string
  notes?: string
  created_at: string
  updated_at: string
}

export const useWifiNetworks = (userId: string | undefined) => {
  const [networks, setNetworks] = useState<WifiNetwork[]>([])
  const [loading, setLoading] = useState(true)

  const fetchNetworks = () => {
    if (!userId) {
      setNetworks([])
      setLoading(false)
      return
    }

    try {
      const storedNetworks = storage.getNetworks(userId)
      const decryptedNetworks = storedNetworks.map(network => ({
        ...network,
        password: decryptPassword(network.password)
      }))

      setNetworks(decryptedNetworks)
    } catch (error) {
      toast.error('Failed to fetch networks')
      console.error('Error fetching networks:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNetworks()
  }, [userId])

  const addNetwork = async (networkData: Omit<WifiNetwork, 'id' | 'created_at' | 'updated_at'>) => {
    if (!userId) return

    try {
      const now = new Date().toISOString()
      const newNetwork: WifiNetwork = {
        id: crypto.randomUUID(),
        ...networkData,
        password: encryptPassword(networkData.password),
        created_at: now,
        updated_at: now
      }

      storage.addNetwork(userId, newNetwork)

      const displayNetwork = {
        ...newNetwork,
        password: networkData.password
      }

      setNetworks(prev => [displayNetwork, ...prev])
      toast.success('Network added successfully!')
    } catch (error) {
      toast.error('Failed to add network')
      console.error('Error adding network:', error)
    }
  }

  const updateNetwork = async (id: string, networkData: Partial<Omit<WifiNetwork, 'id' | 'created_at' | 'updated_at'>>) => {
    if (!userId) return

    try {
      const updates: any = {
        ...networkData,
        updated_at: new Date().toISOString()
      }

      if (networkData.password) {
        updates.password = encryptPassword(networkData.password)
      }

      storage.updateNetwork(userId, id, updates)

      setNetworks(prev => prev.map(network =>
        network.id === id ? { ...network, ...networkData } : network
      ))
      toast.success('Network updated successfully!')
    } catch (error) {
      toast.error('Failed to update network')
      console.error('Error updating network:', error)
    }
  }

  const deleteNetwork = async (id: string) => {
    if (!userId) return

    try {
      storage.deleteNetwork(userId, id)
      setNetworks(prev => prev.filter(network => network.id !== id))
      toast.success('Network deleted successfully!')
    } catch (error) {
      toast.error('Failed to delete network')
      console.error('Error deleting network:', error)
    }
  }

  return {
    networks,
    loading,
    addNetwork,
    updateNetwork,
    deleteNetwork,
    refetch: fetchNetworks
  }
}