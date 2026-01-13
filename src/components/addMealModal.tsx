import { useRef, useEffect, useState, useMemo } from 'react'
import { Keyboard, Modal, Text, View, Pressable, Animated, StyleSheet, TextInput, Button, Dimensions, TouchableOpacity } from 'react-native';
import { useTheme } from '@src/theme/ThemeContext';
import { ThemeType } from '@types';

interface MealModalProps {
    modalVisible: boolean;
    setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
    mealLabel: string;
    initialText: string;
    onClose: () => void;
    onSave: (newContent: string) => void;
}

const { height } = Dimensions.get('window');

export const AddMealModal: React.FC<MealModalProps> = ({
    modalVisible, setModalVisible, mealLabel, initialText, onClose, onSave
}) => {

  // Get style theme
  const { theme } = useTheme();
  const styles = useMemo(() => getStyles(theme), [theme]);

    const animationValue = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

    useEffect(() => {
        if (modalVisible) {

            animationValue.setValue(0)

            // Animate to opacity 1 when modal becomes visible
            Animated.timing(animationValue, {
                toValue: 1,
                duration: 300, // Duration of the fade animation
                useNativeDriver: true,
            }).start();
        } else {
             // Animate to opacity 0 when modal becomes hidden
            Animated.timing(animationValue, {
                toValue: 0,
                duration: 300, 
                useNativeDriver: true,
            }).start();
        }
    }, [modalVisible, animationValue]);

    const backgroundOpacity = animationValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    })

    const contentTranslateY = animationValue.interpolate({
        inputRange: [0, 1],
        outputRange: [height, 0],
    })

    const closeModal = () => {
        Keyboard.dismiss();
        setModalVisible(false);
    }

    const handleSave = () => {
        Keyboard.dismiss();
        const trimmed = mealInputContent.trim()
        onSave(trimmed)
    }

    const handleDelete = () => {
        Keyboard.dismiss();
        setMealInputContent('');
        handleSave();
        closeModal();
    }

    // Stateful text variable for meal input
    const [mealInputContent, setMealInputContent] = useState('');

    return (
        <Modal
            animationType='none'
            transparent={true}
            visible={modalVisible}
            onRequestClose={ () => {
                setModalVisible(false);
                alert("Modal has been closed.");
            }}
        >
            <Animated.View style={[
                styles.modalCenteredView,
                { opacity: backgroundOpacity }
            ]}>
                <Pressable style={StyleSheet.absoluteFill} onPress={closeModal}>
                    <Animated.View style={[
                        styles.modalBackgroundView,
                        { transform: [{ translateY: contentTranslateY }]}
                    ]}>
                        <View style={styles.modalBackgroundView}>
                            <View style={styles.modalView}>
                                <Pressable onPress={(e) => e.stopPropagation()}> 
                                    <Text style={styles.modalTitle}>
                                        {mealLabel}
                                    </Text>
                                    <TextInput 
                                        style={styles.modalInputField}
                                        placeholder='Enter your meal...'
                                        placeholderTextColor="#A9A9A9"
                                        onChangeText={setMealInputContent}
                                    >{initialText}</TextInput>
                                    <View style={styles.line} />
                                    <View style={styles.actionRow}>
                                        <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
                                            <Text style={[styles.actionButtonLabel, { color: "red" }]}>
                                                Delete
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.actionButton} onPress={handleSave}>
                                            <Text style={[styles.actionButtonLabel]}>
                                                Save
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </Pressable>
                            </View>
                        </View>
                    </Animated.View>
                </Pressable>
            </Animated.View>
        </Modal>
    )
}

const getStyles = (theme: ThemeType) => StyleSheet.create({
    modalCenteredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.modalShadow, // Semi-transparent overlay
    width: "100%"
  },
   modalBackgroundView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: "100%",
   },
  // Style for the actual modal content box
  modalView: {
    margin: 20,
    backgroundColor: theme.background,
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: theme.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
  },
  modalTitle: {
    margin: 15,
    paddingVertical: 10,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: "bold",
    color: theme.label,
  },
  modalInputField: {
    paddingVertical: 10,
    textAlign: 'left',
    fontSize: 18,
    color: theme.label,
  },
  line: {
    height: 2,
    backgroundColor: theme.separator,
    marginTop: 5,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: "80%",
  },
  actionButton: {
    flex: 1,
    height: 20,
    width: 30,
    marginLeft: 30,
    marginTop: 20,
  },
  actionButtonLabel: {
    fontSize: 18,
    fontWeight: 500,
    color: theme.crosshair,
  },
})
