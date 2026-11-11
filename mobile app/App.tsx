import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  Platform,
  Alert
} from 'react-native';
import Svg, { Path, Circle, Rect, Polyline, Line } from 'react-native-svg';

// Custom Minimalist SVG Icons
const LogoIcon = () => (
  <Svg width="26" height="26" viewBox="0 0 100 100" fill="none">
    <Path d="M 18 80 Q 50 12, 82 80" stroke="#171717" strokeWidth="15" strokeLinecap="round" />
    <Circle cx="50" cy="52" r="8" fill="#4f46e5" />
  </Svg>
);

const MoonIcon = () => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </Svg>
);

const CheckIcon = () => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Polyline points="20 6 9 17 4 12" />
  </Svg>
);

const SendIcon = () => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Line x1="12" y1="19" x2="12" y2="5" />
    <Polyline points="5 12 12 5 19 12" />
  </Svg>
);

const MicIcon = () => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#525252" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
    <Path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <Line x1="12" y1="19" x2="12" y2="22" />
  </Svg>
);

const GitHubIcon = () => (
  <Svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#525252" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4" />
  </Svg>
);

type Task = {
  id: string;
  title: string;
  repo: string;
  status: 'completed' | 'running' | 'queued';
  time: string;
  summary: string;
};

export default function App() {
  const [inputText, setInputText] = useState('');
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'AuthManager JWT Verification Refactor',
      repo: 'ideaai-production',
      status: 'completed',
      time: '12m ago',
      summary: 'Separated token signing from controller logic. 4 unit tests passing on Azure worker.'
    },
    {
      id: '2',
      title: 'Clean Unused CSS & Migrate to Tailwind v4',
      repo: 'ideaai-production',
      status: 'running',
      time: 'In progress',
      summary: 'Analyzing 24 components and purging redundant utility classes.'
    }
  ]);

  const handleSendPrompt = () => {
    if (!inputText.trim()) return;
    const newTask: Task = {
      id: Date.now().toString(),
      title: inputText,
      repo: 'ideaai-production',
      status: 'running',
      time: 'Just now',
      summary: 'Dispatched to Azure 32GB E-Class VM. Worker starting task...'
    };
    setTasks([newTask, ...tasks]);
    setInputText('');
    Alert.alert('Task Dispatched', 'IdeaAI Azure Cloud Engine is now working on this task.');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f3f3f3" />
      
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <LogoIcon />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.appName}>IdeaAI</Text>
            <Text style={styles.subTitle}>Autonomous Mobile Companion</Text>
          </View>
        </View>

        {/* Live Azure Status Badge */}
        <View style={styles.badge}>
          <View style={styles.liveDot} />
          <Text style={styles.badgeText}>Azure 32GB Live</Text>
        </View>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 110 }}>
        
        {/* Night Shift Hero Card */}
        <View style={styles.nightShiftCard}>
          <View style={styles.cardHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MoonIcon />
              <Text style={styles.cardTitle}>Night Shift Protocol</Text>
            </View>
            <View style={styles.activePill}>
              <Text style={styles.activePillText}>STANDBY</Text>
            </View>
          </View>
          <Text style={styles.cardBody}>
            When your laptop is closed, IdeaAI connects to your GitHub repository to execute long refactors and run test suites before sunrise.
          </Text>
          
          <View style={styles.repoRow}>
            <GitHubIcon />
            <Text style={styles.repoText}>ideaai-production (main)</Text>
          </View>
        </View>

        {/* Section: Live Activity Feed */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>AUTONOMOUS ACTIVITY</Text>
          <Text style={styles.sectionCount}>{tasks.length} tasks</Text>
        </View>

        {tasks.map((task) => (
          <View key={task.id} style={styles.taskCard}>
            <View style={styles.taskHeader}>
              <Text style={styles.taskTitle}>{task.title}</Text>
              <View style={[styles.statusBadge, task.status === 'completed' ? styles.statusCompleted : styles.statusRunning]}>
                {task.status === 'completed' && <CheckIcon />}
                <Text style={[styles.statusText, task.status === 'completed' ? { color: '#16a34a' } : { color: '#2563eb' }]}>
                  {task.status === 'completed' ? ' Ready for PR' : ' Running...'}
                </Text>
              </View>
            </View>

            <Text style={styles.taskSummary}>{task.summary}</Text>

            <View style={styles.taskFooter}>
              <Text style={styles.taskTime}>{task.time}</Text>
              {task.status === 'completed' ? (
                <TouchableOpacity 
                  style={styles.reviewButton}
                  onPress={() => Alert.alert('GitHub PR', 'Pull Request ready on GitHub: github.com/ideaai-production/pull/14')}
                >
                  <Text style={styles.reviewButtonText}>Review PR</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.workerRunningText}>⚡ Azure Worker Active</Text>
              )}
            </View>
          </View>
        ))}

      </ScrollView>

      {/* Floating Bottom Input Bar */}
      <View style={styles.inputContainer}>
        <View style={styles.inputCard}>
          <TextInput
            style={styles.input}
            placeholder="Instruct IdeaAI on your repository..."
            placeholderTextColor="#8a8a8a"
            value={inputText}
            onChangeText={setInputText}
          />
          <View style={styles.inputActions}>
            <TouchableOpacity 
              style={styles.micButton} 
              onPress={() => Alert.alert('Voice Command', 'Listening for speech input...')}
            >
              <MicIcon />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.sendButton, !inputText.trim() && { opacity: 0.5 }]} 
              onPress={handleSendPrompt}
              disabled={!inputText.trim()}
            >
              <SendIcon />
            </TouchableOpacity>
          </View>
        </View>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f3f3f3',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    backgroundColor: '#f3f3f3',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#171717',
    letterSpacing: -0.3,
  },
  subTitle: {
    fontSize: 11,
    color: '#737373',
    fontWeight: '500',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7f7f4',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16a34a',
    marginRight: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#404040',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  nightShiftCard: {
    backgroundColor: '#f2f2f2',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#171717',
    marginLeft: 8,
  },
  activePill: {
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  activePillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4338ca',
    letterSpacing: 0.5,
  },
  cardBody: {
    fontSize: 12,
    color: '#525252',
    lineHeight: 18,
    marginBottom: 12,
  },
  repoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7f7f4',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    alignSelf: 'flex-start',
  },
  repoText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#404040',
    marginLeft: 6,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8a8a8a',
    letterSpacing: 0.8,
  },
  sectionCount: {
    fontSize: 11,
    color: '#8a8a8a',
    fontWeight: '500',
  },
  taskCard: {
    backgroundColor: '#f2f2f2',
    borderRadius: 16,
    padding: 15,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    marginBottom: 12,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  taskTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#171717',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusCompleted: {
    backgroundColor: '#dcfce7',
  },
  statusRunning: {
    backgroundColor: '#dbeafe',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  taskSummary: {
    fontSize: 12,
    color: '#525252',
    lineHeight: 17,
    marginBottom: 10,
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  taskTime: {
    fontSize: 11,
    color: '#8a8a8a',
  },
  reviewButton: {
    backgroundColor: '#171717',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
  },
  reviewButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#ffffff',
  },
  workerRunningText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2563eb',
  },
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    backgroundColor: 'transparent',
  },
  inputCard: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    paddingHorizontal: 14,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  input: {
    flex: 1,
    fontSize: 13,
    color: '#171717',
    paddingVertical: 6,
  },
  inputActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  micButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f7f7f4',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#171717',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
