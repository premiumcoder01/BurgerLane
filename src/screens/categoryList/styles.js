import {StyleSheet} from 'react-native';
import {Colors, Sizes} from '../../constants/styles';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    marginBottom: Sizes.fixPadding,
    backgroundColor: 'white',
    elevation: 4,
    // padding: 10,
    borderRadius: 20,
    margin: 5,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  imgContainer: {
    width: '100%',
    height: 150,
    borderRadius: Sizes.fixPadding + 10.0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    marginBottom: 10,
  },
  productContainer: {flex: 1, marginLeft: Sizes.fixPadding},
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 10,
  },
  iconContainer: {
    width: 22.0,
    height: 22.0,
    borderRadius: 11.0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryColor,
  },
});
export default styles;
