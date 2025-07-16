import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';

interface WinModalProps {
  visible: boolean;
  onClose: () => void;
  onNextLevel: () => void;
  onRestart: () => void;
  moveCount: number;
  levelName: string;
  hasNextLevel: boolean;
  shouldReward?: boolean;
}

export const WinModal: React.FC<WinModalProps> = ({
  visible,
  onClose,
  onNextLevel,
  onRestart,
  moveCount,
  levelName,
  hasNextLevel,
  shouldReward = false,
}) => {
  const [scaleAnim] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    if (visible) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    } else {
      scaleAnim.setValue(0);
    }
  }, [visible, scaleAnim]);

  const handleClaimReward = () => {
    console.log('Claiming reward...');
    onClose();
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View 
          style={[
            styles.modalContainer,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.content}>
            <Text style={styles.title}>🎉 Level Complete!</Text>
            <Text style={styles.subtitle}>{levelName}</Text>
            
            <View style={styles.statsContainer}>
              <Text style={styles.statsText}>
                Completed in {moveCount} moves
              </Text>
            </View>

            {shouldReward && (
              <View style={styles.rewardContainer}>
                <Text style={styles.rewardText}>
                  You've earned a $0.05/gal discount!
                </Text>
                <TouchableOpacity
                  style={styles.rewardButton}
                  onPress={handleClaimReward}
                >
                  <Text style={styles.rewardButtonText}>Claim Reward</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.restartButton]}
                onPress={onRestart}
              >
                <Text style={styles.buttonText}>Restart</Text>
              </TouchableOpacity>

              {hasNextLevel && (
                <TouchableOpacity
                  style={[styles.button, styles.nextButton]}
                  onPress={onNextLevel}
                >
                  <Text style={styles.nextButtonText}>Next Level</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    margin: 20,
    minWidth: 280,
    maxWidth: 360,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#059669',
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '600',
  },
  statsContainer: {
    backgroundColor: '#f1f5f9',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    width: '100%',
  },
  statsText: {
    fontSize: 14,
    color: '#374151',
    textAlign: 'center',
    fontWeight: '500',
  },
  rewardContainer: {
    backgroundColor: '#dcfce7',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  rewardText: {
    fontSize: 14,
    color: '#059669',
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: 12,
  },
  rewardButton: {
    backgroundColor: '#c3f53c',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  rewardButtonText: {
    color: '#1f2937',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  restartButton: {
    backgroundColor: '#ef4444',
  },
  nextButton: {
    backgroundColor: '#c3f53c',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  nextButtonText: {
    color: '#1f2937',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
}); 