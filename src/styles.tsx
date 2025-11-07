import { StyleSheet, Dimensions } from 'react-native'

const { width } = Dimensions.get('window');
const GRID_PADDING = 20
const CARD_MARGIN = 5
const CARD_SIZE = (width - GRID_PADDING - 2 * CARD_MARGIN) / 2;

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f0f5', // Light background for the overall screen
    paddingVertical: 40,
  },
  container: {
    flex: 1,
    paddingHorizontal: CARD_MARGIN,
    // Note: The vertical lines on the side suggest a repeated background image or texture
    // which cannot be done with simple background color.
  },

  // === A. Header Styles ===
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderBottomWidth: 1, // Subtle line under the header
    borderBottomColor: '#eee',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // The date itself seems to be clickable, with chevrons for navigation
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  // === B. Grid and Meal Card Styles ===
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Allows cards to wrap to the next line
    justifyContent: 'space-around', // Distributes cards horizontally
    paddingTop: 20,
    paddingHorizontal: CARD_MARGIN - 5,
  },
  mealCard: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    borderRadius: 15,
    margin: CARD_MARGIN / 2, // Half margin to space them out
    backgroundColor: 'white',
    // Green border on hover/tap (active state)
    borderWidth: 2,
    borderColor: '#E8F5E9', // Very light green border for non-active state
    alignItems: 'center',
    justifyContent: 'center',
    // Subtle shadow (might need a dedicated shadow style for true iOS look)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
    marginBottom: 20,
  },
  mealLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 10,
    color: '#333',
  },
  // Icon placeholder styles
  iconBox: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    // The icon is a complex shape, best done with SVG or absolute positioning
  },
  crosshairSquare: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderWidth: 2,
    borderColor: '#66BB6A', // Light green
    borderRadius: 5,
  },
  crosshairVertical: {
    position: 'absolute',
    width: 15,
    height: 2,
    backgroundColor: '#66BB6A',
  },
  crosshairHorizontal: {
    position: 'absolute',
    width: 2,
    height: 15,
    backgroundColor: '#66BB6A',
  },

  // === C. Footer Card Styles ===
  footerContainer: {
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#E8F5E9', // Lightest green background for the footer
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'flex-start', // Align text to the left (LTR language)
  },
  footerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#388E3C', // A darker green
    marginBottom: 5,
  },
  footerText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    textAlign: "left",
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 15,
  },
  minusButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#ddd',
    borderWidth: 1,
  },
  minusText: {
    fontSize: 24,
    color: '#555',
  },
  plusButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#388E3C', // Primary green color
    justifyContent: 'center',
    alignItems: 'center',
    // Shadow if desired
  },
  plusText: {
    fontSize: 24,
    color: 'white',
    lineHeight: 30, // Adjust line height to center the plus sign
  },
  progressPill: {
    flex: 1, // Takes up the remaining space
    height: 30,
    marginHorizontal: 15,
    borderRadius: 15,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    color: '#388E3C',
    fontWeight: 'bold',
  },
  mealContentContainer: {
    // Ensure this container fills the card and handles alignment
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mealContentText: {
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 5,
      color: '#333', // Use a dark color for readability
  },
  mealLabelSmall: {
      fontSize: 12,
      color: '#666', // Grayed-out label
      textAlign: 'center',
  }
});

export const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  // Style for the background container when transparent={true}
  modalCenteredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay
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
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
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
  },
  modalInputField: {
    paddingVertical: 10,
    textAlign: 'left',
    fontSize: 18,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
  },
  line: {
    height: 2,
    backgroundColor: "#A3A3A3",
    marginTop: 5,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
});

export const logWeightStyles = StyleSheet.create({
  weightScreenTitle: {
    paddingHorizontal: 15,
    fontSize: 24,
    fontWeight: "bold",
  },
  weightInputField: {
    padding: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginTop: 15,
    marginHorizontal: 15,
    fontSize: 18,
  },
  logWeightButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    width: '40%',
    alignSelf: 'center',
    marginTop: 20,
    color: 'black',
    padding: 10,
    borderRadius: 5,
    borderColor: '#000',
    borderWidth: 1,
    textAlign: 'center',
  },
  logWeightTrashButton: {
    paddingRight: 30,
  },
  inputTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weightGraphTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 25,
  },
  weightGraphContainer: {
    height: 420,
    width: "95%",
    marginLeft: 15,
    padding: 10,
    marginBottom: 30,
    marginRight: 20,
  },
  chartContainer: {
    height: 400,
    width: width - 30,
    alignSelf: "center",
  },
  weightRecordText: {
    fontSize: 18,
    marginVertical: 10,
  },
  weightRecordTrash: {
    fontSize: 24,
    marginVertical: 10,
  },
  weightRecordsList: {
    marginVertical: 40,
    padding: 10,
    marginHorizontal: 20,
    justifyContent: 'space-between',
  },
  weightRecordSeparator: {
    height: 1,
    backgroundColor: "#C4C4C4",
    alignSelf: "center",
    width: width - 80,
  },
  weightRecordListHeader: {
    fontSize: 16,
    marginVertical: 10,
    alignSelf: "center",
    width: 55,
    marginHorizontal: 5,
  },
  weightRecordListHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: width - 115,
    marginLeft: 20,
  }
});