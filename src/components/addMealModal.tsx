import { useRef, useEffect, useState } from 'react'
import { modalStyles } from '@styles'
import { Modal, Text, View, Pressable, Animated, StyleSheet, TextInput, Button, Dimensions } from 'react-native';

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
        setModalVisible(false);
    }

    const handleSave = () => {
        const trimmed = mealInputContent.trim()
        onSave(trimmed)
    }

    const handleDelete = () => {
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
                modalStyles.modalCenteredView,
                { opacity: backgroundOpacity }
            ]}>
                <Pressable style={StyleSheet.absoluteFill} onPress={closeModal}>
                    <Animated.View style={[
                        modalStyles.modalBackgroundView,
                        { transform: [{ translateY: contentTranslateY }]}
                    ]}>
                        <View style={modalStyles.modalBackgroundView}>
                            <View style={modalStyles.modalView}>
                                <Pressable onPress={(e) => e.stopPropagation()}> 
                                    <Text style={modalStyles.modalTitle}>
                                        {mealLabel}
                                    </Text>
                                    <TextInput 
                                        style={modalStyles.modalInputField}
                                        placeholder='Enter your meal...'
                                        placeholderTextColor="#A9A9A9"
                                        onChangeText={setMealInputContent}
                                    >{initialText}</TextInput>
                                    <View style={modalStyles.line} />
                                    <View style={modalStyles.actionRow}>
                                        <Button title='Delete' color={"red"} onPress={handleDelete}/>
                                        <Button title='Save' onPress={handleSave}/>
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