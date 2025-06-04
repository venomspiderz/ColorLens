import { StyleSheet, View, Text, ScrollView, Switch, TouchableOpacity, Share, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Moon, Share2, Info, Palette } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';

export default function SettingsScreen() {
  const { isDarkMode, setIsDarkMode, isColorCorrectionEnabled, setIsColorCorrectionEnabled, colors } = useTheme();

  const handleShare = async () => {
    try {
      await Share.share({
        message: 'Check out ColorLens Pro - The ultimate color analysis tool! https://colorlens.pro',
        title: 'Share ColorLens Pro'
      });
    } catch (error) {
      console.error('Error sharing app:', error);
    }
  };

  const handleAbout = () => {
    Linking.openURL('https://colorlens.pro/about');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Appearance</Text>
          
          <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
            <View style={styles.settingIconContainer}>
              <Moon size={22} color={colors.primary} />
            </View>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Dark Mode</Text>
            <Switch
              value={isDarkMode}
              onValueChange={setIsDarkMode}
              trackColor={{ false: '#D1D1D6', true: '#34C759' }}
              ios_backgroundColor="#D1D1D6"
            />
          </View>
        </View>
        
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Color Analysis</Text>
          
          <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
            <View style={styles.settingIconContainer}>
              <Palette size={22} color={colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Color Correction</Text>
              <Text style={[styles.settingDescription, { color: colors.secondary }]}>
                Enable this option when analyzing colors in challenging lighting conditions
              </Text>
            </View>
            <Switch
              value={isColorCorrectionEnabled}
              onValueChange={setIsColorCorrectionEnabled}
              trackColor={{ false: '#D1D1D6', true: '#34C759' }}
              ios_backgroundColor="#D1D1D6"
            />
          </View>
        </View>
        
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>About</Text>
          
          <TouchableOpacity 
            style={[styles.settingItem, { borderBottomColor: colors.border }]} 
            onPress={handleShare}
          >
            <View style={styles.settingIconContainer}>
              <Share2 size={22} color={colors.primary} />
            </View>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Share App</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.settingItem, { borderBottomColor: colors.border }]} 
            onPress={handleAbout}
          >
            <View style={styles.settingIconContainer}>
              <Info size={22} color={colors.primary} />
            </View>
            <Text style={[styles.settingLabel, { color: colors.text }]}>About ColorLens Pro</Text>
          </TouchableOpacity>
          
          <View style={styles.versionContainer}>
            <Text style={[styles.versionText, { color: colors.secondary }]}>Version 1.0.0</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginTop: 20,
    borderRadius: 10,
    overflow: 'hidden',
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 16,
    marginTop: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  settingIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(10, 132, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
    marginRight: 8,
  },
  settingLabel: {
    flex: 1,
    fontSize: 16,
  },
  settingDescription: {
    fontSize: 12,
    marginTop: 2,
  },
  versionContainer: {
    padding: 16,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 14,
  },
});