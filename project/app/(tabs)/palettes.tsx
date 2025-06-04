import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus } from 'lucide-react-native';
import { ColorPaletteCard } from '@/components/ColorPaletteCard';
import { useState, useEffect } from 'react';
import { colorStorage } from '@/services/colorStorage';
import { useTheme } from '@/context/ThemeContext';

export default function PalettesScreen() {
  const { colors } = useTheme();
  const [palettes, setPalettes] = useState<Array<{
    id: string;
    name: string;
    colors: string[];
    date: string;
  }>>([]);

  useEffect(() => {
    loadPalettes();
    
    const unsubscribe = colorStorage.onPalettesChange(loadPalettes);
    
    return () => unsubscribe();
  }, []);

  const loadPalettes = async () => {
    try {
      const storedPalettes = await colorStorage.getAllPalettes();
      setPalettes(storedPalettes.map(palette => ({
        ...palette,
        date: new Date(palette.updatedAt).toLocaleDateString()
      })));
    } catch (error) {
      console.error('Error loading palettes:', error);
    }
  };

  const renderPalette = ({ item }) => (
    <ColorPaletteCard palette={item} onUpdate={loadPalettes} />
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>My Palettes</Text>
        <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.card }]}>
          <Plus size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={palettes}
        renderItem={renderPalette}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
  },
});