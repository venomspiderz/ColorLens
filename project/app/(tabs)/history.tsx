import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Clock, Trash2 } from 'lucide-react-native';
import { ColorHistoryItem } from '@/components/ColorHistoryItem';
import { useState, useEffect, useRef } from 'react';
import { colorStorage, EVENTS } from '@/services/colorStorage';
import { useTheme } from '@/context/ThemeContext';

export default function HistoryScreen() {
  const { colors } = useTheme();
  const [colorHistory, setColorHistory] = useState<Array<{
    id: string;
    color: string;
    name: string;
    date: string;
    location?: string;
  }>>([]);
  const isMounted = useRef(true);

  useEffect(() => {
    loadHistory();
    
    const unsubscribe = colorStorage.onHistoryChange(loadHistory);
    
    return () => {
      isMounted.current = false;
      unsubscribe();
    };
  }, []);

  const loadHistory = async () => {
    try {
      const history = await colorStorage.getColorHistory(10);
      if (isMounted.current) {
        setColorHistory(history.map(color => ({
          id: color.id,
          color: color.hex,
          name: color.name,
          date: new Date(color.createdAt).toLocaleString(),
          location: color.location
        })));
      }
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const clearHistory = async () => {
    try {
      await colorStorage.clearHistory();
      if (isMounted.current) {
        setColorHistory([]);
      }
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  };

  const renderHistoryItem = ({ item }) => (
    <ColorHistoryItem item={item} onUpdate={loadHistory} />
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Color History</Text>
        {colorHistory.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={clearHistory}>
            <Trash2 size={20} color={colors.error} />
          </TouchableOpacity>
        )}
      </View>
      
      {colorHistory.length > 0 ? (
        <FlatList
          data={colorHistory}
          renderItem={renderHistoryItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Clock size={64} color={colors.secondary} style={styles.emptyIcon} />
          <Text style={[styles.emptyText, { color: colors.text }]}>No color history yet</Text>
          <Text style={[styles.emptySubtext, { color: colors.secondary }]}>
            Colors you analyze will appear here
          </Text>
        </View>
      )}
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
  clearButton: {
    padding: 8,
  },
  listContainer: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    textAlign: 'center',
  },
});