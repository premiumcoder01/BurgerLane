import {StyleSheet} from 'react-native';
import {Colors, Sizes} from '../../constants/styles';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: Sizes.fixPadding * 2.0,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  imgContainer: {
    width: 90.0,
    height: 100.0,
    borderRadius: Sizes.fixPadding - 5.0,
  },
  productContainer: {flex: 1, marginLeft: Sizes.fixPadding},
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
