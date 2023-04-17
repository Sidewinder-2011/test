/* eslint-disable react/no-multi-comp */
import React from "react";
import PropTypes from "prop-types";
import shuffle from "lodash/shuffle";
import throttle from "lodash/throttle";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Image
} from "react-native";
import {
  initNavigation,
  withFocusable
} from "@noriginmedia/react-spatial-navigation";
import Icon from "react-native-vector-icons/Feather";

initNavigation({
  debug: true,
  visualDebug: false
});

// SpatialNavigation.setKeyMap(keyMap); -> Custom key map

const KEY_ENTER = "enter";

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    maxHeight: 600,
    backgroundColor: "black",
    overflow: "hidden"
  },
  content: {
    flex: 1,
    overflow: "hidden"
  },
  menu: {
    marginTop: 50,
    margin: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  menuFocused: {
    backgroundColor: "#000"
  },
  menuItem: {
    height: 35,
    borderRadius: 50,
    marginHorizontal: 10,
    paddingHorizontal: 18,
    backgroundColor: "#f8f258",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row"
  },
  activeWrapper: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "flex-start"
  },
  activeProgram: {
    width: 160,
    height: 120
  },
  activeProgramTitle: {
    padding: 20,
    color: "white"
  },
  programWrapper: {
    padding: 10,
    alignItems: "center",
    overflow: "hidden"
  },
  program: {
    height: 140,
    width: 260
  },
  programTitle: {
    color: "white",
    textAlign: "left"
  },
  categoryWrapper: {
    padding: 20,
    overflow: "hidden"
  },
  categoryTitle: {
    color: "white"
  },
  categoriesWrapper: {
    flex: 1,
    overflow: "hidden"
  },
  menuItemFocus: {
    backgroundColor: "white",
    shadowColor: "grey",
    shadowOpacity: 1,
    shadowRadius: 20,
    shadowOffset: {
      width: 0,
      height: 5
    }
  },
  focusedBorder: {
    borderWidth: 4,
    borderColor: "red",
    backgroundColor: "white"
  }
});

const categories = shuffle([
  {
    title: "Featured",
    icon: "<FiHome style={{ marginRight: 10 }} />"
  },
  {
    title: "Cool"
  },
  {
    title: "Decent"
  },
  {
    title: "Decent"
  },
  {
    title: "Decent"
  }
]);

const programs = shuffle([
  {
    title: "Peaky Blinderss",
    img:
      "https://www.themoviedb.org/t/p/original/hXJJ0dr7BsfK3AafSQdEpnIpwJV.jpg"
  },
  {
    title: "Program 2",
    color: "#dd4558"
  },
  {
    title: "Program 3",
    color: "#7ddd6a"
  },
  {
    title: "Program 4",
    color: "#dddd4d"
  },
  {
    title: "Program 5",
    color: "#8299dd"
  },
  {
    title: "Program 6",
    color: "#edab83"
  },
  {
    title: "Program 7",
    color: "#60ed9e"
  },
  {
    title: "Program 8",
    color: "#d15fb6"
  },
  {
    title: "Program 9",
    color: "#c0ee33"
  }
]);

const RETURN_KEY = 8;
const B_KEY = 66;

/* eslint-disable react/prefer-stateless-function */
class MenuItem extends React.PureComponent {
  render() {
    // console.log('Menu item rendered: ', this.props.realFocusKey);
    return (
      <TouchableOpacity
        style={[
          styles.menuItem,
          this.props.focused ? styles.menuItemFocus : null
        ]}
      >
        <img width="18" height="18" src={this.props.img} />
        <Text
          style={{
            fontWeight: "700",
            marginLeft: 8
          }}
        >
          {this.props.title}
        </Text>
      </TouchableOpacity>
    );
  }
}

MenuItem.propTypes = {
  title: PropTypes.bool.isRequired,
  img: PropTypes.bool.isRequired,
  focused: PropTypes.bool.isRequired

  // realFocusKey: PropTypes.string.isRequired
};

const MenuItemFocusable = withFocusable()(MenuItem);

class Menu extends React.PureComponent {
  constructor(props) {
    super(props);

    this.onPressKey = this.onPressKey.bind(this);
  }

  componentDidMount() {
    this.props.setFocus();

    window.addEventListener("keydown", this.onPressKey);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.onPressKey);
  }

  onPressKey(event) {
    if (event.keyCode === RETURN_KEY) {
      this.props.setFocus();
    }
  }

  render() {
    // console.log('Menu rendered: ', this.props.realFocusKey);

    return (
      <View
        style={[
          styles.menu,
          this.props.hasFocusedChild ? styles.menuFocused : null
        ]}
      >
        <MenuItemFocusable
          title="Ana Sayfa"
          img="https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/home/wght600/48px.svg"
          focusKey={"MENU-1"}
        />
        <MenuItemFocusable
          title="Dizi"
          img="https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/video_library/wght600/48px.svg"
          focusKey={"MENU-2"}
        />
        <MenuItemFocusable
          title="Film"
          img="https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/movie/wght600/48px.svg"
          focusKey={"MENU-3"}
        />
      </View>
    );
  }
}

Menu.propTypes = {
  setFocus: PropTypes.func.isRequired,
  hasFocusedChild: PropTypes.bool.isRequired

  // realFocusKey: PropTypes.string.isRequired
};

const MenuFocusable = withFocusable({
  trackChildren: true
})(Menu);

class Content extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      currentProgram: null,
      blockNavigationOut: false
    };

    this.onPressKey = this.onPressKey.bind(this);
    this.onProgramPress = this.onProgramPress.bind(this);
  }

  componentDidMount() {
    window.addEventListener("keydown", this.onPressKey);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.onPressKey);
  }

  onPressKey(event) {
    if (event.keyCode === B_KEY) {
      const { blockNavigationOut: blocked } = this.state;

      console.warn(
        `blockNavigationOut: ${!blocked}. Press B to ${
          blocked ? "block" : "unblock "
        }`
      );
      this.setState((prevState) => ({
        blockNavigationOut: !prevState.blockNavigationOut
      }));
    }
  }

  onProgramPress(programProps, { pressedKeys } = {}) {
    if (pressedKeys && pressedKeys[KEY_ENTER] > 1) {
      return;
    }
    this.setState({
      currentProgram: programProps
    });
  }

  render() {
    const { blockNavigationOut } = this.state;

    // console.log('content rendered: ', this.props.realFocusKey);

    return (
      <View style={styles.content}>
        <CategoriesFocusable
          focusKey={"CATEGORIES"}
          onProgramPress={this.onProgramPress}
          blockNavigationOut={blockNavigationOut}
        />
      </View>
    );
  }
}

Content.propTypes = {
  // realFocusKey: PropTypes.string.isRequired
};

const ContentFocusable = withFocusable()(Content);

class Active extends React.PureComponent {
  render() {
    const { program } = this.props;

    const style = {
      backgroundColor: program ? program.color : "grey"
    };

    return (
      <View style={styles.activeWrapper}>
        <Image
          source={{ uri: program.img }}
          style={{ wight: "100%", height: "100%" }}
        />
        <Text style={styles.activeProgramTitle}>
          {program ? program.title : "No Program"}
        </Text>
      </View>
    );
  }
}

Active.propTypes = {
  program: PropTypes.shape({
    title: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    img: PropTypes.string.isRequired
  })
};

Active.defaultProps = {
  program: null
};

class Program extends React.PureComponent {
  render() {
    // console.log('Program rendered: ', this.props.realFocusKey);

    const { color, onPress, focused, title, img } = this.props;

    const style = {
      backgroundColor: color
    };

    return (
      <TouchableOpacity onPress={onPress} style={styles.programWrapper}>
        <View
          style={[style, styles.program, focused ? styles.focusedBorder : null]}
        >
          <Image
            source={{
              uri: img
            }}
            style={{ wight: "100%", height: "100%" }}
          />
        </View>
        <Text style={styles.programTitle}>{title}</Text>
      </TouchableOpacity>
    );
  }
}

Program.propTypes = {
  title: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  focused: PropTypes.bool.isRequired

  // realFocusKey: PropTypes.string.isRequired
};

const ProgramFocusable = withFocusable()(Program);

class Category extends React.PureComponent {
  constructor(props) {
    super(props);

    this.scrollRef = null;

    this.onProgramFocused = this.onProgramFocused.bind(this);
    this.onProgramArrowPress = this.onProgramArrowPress.bind(this);
  }

  onProgramFocused({ x }) {
    this.scrollRef.scrollTo({
      x
    });
  }

  onProgramArrowPress(direction, { categoryIndex, programIndex }) {
    if (
      direction === "right" &&
      programIndex === programs.length - 1 &&
      categoryIndex < categories.length - 1
    ) {
      this.props.setFocus(`CATEGORY-${categoryIndex + 1}`);

      return false;
    }

    return true;
  }

  render() {
    // console.log('Category rendered: ', this.props.realFocusKey);

    return (
      <View style={styles.categoryWrapper}>
        <Text style={styles.categoryTitle}>{this.props.title}</Text>
        <ScrollView
          horizontal
          ref={(reference) => {
            if (reference) {
              this.scrollRef = reference;
            }
          }}
        >
          {programs.map((program, index) => (
            <ProgramFocusable
              {...program}
              focusKey={`PROGRAM-${this.props.realFocusKey}-${index}`}
              onPress={() => alert(program.title)}
              onEnterPress={this.props.onProgramPress}
              key={program.title}
              onBecameFocused={this.onProgramFocused}
              onArrowPress={this.onProgramArrowPress}
              programIndex={index}
              categoryIndex={this.props.categoryIndex}
            />
          ))}
        </ScrollView>
      </View>
    );
  }
}

Category.propTypes = {
  title: PropTypes.string.isRequired,
  onProgramPress: PropTypes.func.isRequired,
  realFocusKey: PropTypes.string.isRequired,
  categoryIndex: PropTypes.number.isRequired,
  setFocus: PropTypes.func.isRequired
};

const CategoryFocusable = withFocusable()(Category);

class Categories extends React.PureComponent {
  constructor(props) {
    super(props);

    this.scrollRef = null;

    this.onCategoryFocused = this.onCategoryFocused.bind(this);
  }

  onCategoryFocused({ y }) {
    this.scrollRef.scrollTo({
      y
    });
  }

  render() {
    // console.log('Categories rendered: ', this.props.realFocusKey);

    return (
      <ScrollView
        ref={(reference) => {
          if (reference) {
            this.scrollRef = reference;
          }
        }}
        style={styles.categoriesWrapper}
      >
        {categories.map((category, index) => (
          <CategoryFocusable
            focusKey={`CATEGORY-${index}`}
            {...category}
            onProgramPress={this.props.onProgramPress}
            key={category.title}
            onBecameFocused={this.onCategoryFocused}
            categoryIndex={index}

            // preferredChildFocusKey={`PROGRAM-CATEGORY-${index}-${programs.length - 1}`}
          />
        ))}
      </ScrollView>
    );
  }
}

Categories.propTypes = {
  onProgramPress: PropTypes.func.isRequired,
  realFocusKey: PropTypes.string.isRequired
};

const CategoriesFocusable = withFocusable()(Categories);

class Spatial extends React.PureComponent {
  constructor(props) {
    super(props);

    this.onWheel = this.onWheel.bind(this);
    this.throttledWheelHandler = throttle(
      this.throttledWheelHandler.bind(this),
      500,
      { trailing: false }
    );
  }

  componentDidMount() {
    window.addEventListener("wheel", this.onWheel, { passive: false });
  }

  componentWillUnmount() {
    window.removeEventListener("wheel", this.onWheel);
  }

  onWheel(event) {
    event.preventDefault();
    this.throttledWheelHandler(event);
  }

  throttledWheelHandler(event) {
    event.preventDefault();
    const { deltaY, deltaX } = event;
    const { navigateByDirection } = this.props;

    if (deltaY > 1) {
      navigateByDirection("down");
    } else if (deltaY < 0) {
      navigateByDirection("up");
    } else if (deltaX > 1) {
      navigateByDirection("right");
    } else if (deltaX < 1) {
      navigateByDirection("left");
    }
  }

  render() {
    return (
      <View style={styles.wrapper}>
        <MenuFocusable focusKey={"MENU"} />
        <ContentFocusable focusKey={"CONTENT"} />
      </View>
    );
  }
}

Spatial.propTypes = {
  navigateByDirection: PropTypes.func.isRequired
};

const SpatialFocusable = withFocusable()(Spatial);

const App = () => (
  <View
    style={{
      backgroundColor: "black"
    }}
  >
    <SpatialFocusable focusable={false} />
  </View>
);

export default App;
