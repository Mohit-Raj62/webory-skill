import MyButton from './../components/MyButton';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View, ImageBackground, StatusBar, SafeAreaView, Image } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

const Index = () => {
  const router = useRouter();
  const onContinue = () => {
    router.navigate("/login");
    // router.navigate("/techlogin");
  };
  const onTechLogin = () => {
    router.navigate("teacherlogin");
  }; 
  const onattendanceCalendar = () => {
    router.navigate("attendancemark");
  }; 

  return (
    <SafeAreaView style={styles.container}>
      {/* <StatusBar barStyle="light-content" /> */}
      <ImageBackground 
        source={require("@/assets/images/loginSC.png")} 
        style={styles.backgroundImage}
        resizeMode="cover">
        
        <LinearGradient
          colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.7)']}
          style={styles.overlay}>
          <View style={styles.contentContainer}>
            <View style={styles.headerContainer}>
              <Text style={styles.headerText}>Welcome</Text>
              <Text style={styles.subHeaderText}>Mohit Sinha Academy</Text>
            </View>
            
            <Image 
              source={require("@/assets/images/sclogo.png")}
              style={styles.schoollogo} 
            />
            
            <View style={styles.buttonRowContainer}>
              <MyButton 
                title="Student Login" 
                onPress={onContinue}
                buttonColor="#FF671F" // Coral/Orange
                textColor="white"
              />
              <MyButton 
                title="Teacher Login" 
                onPress={onTechLogin}
                buttonColor="#ffffff" // white
                textColor="Black"
              />
              <MyButton  
                title="Contact Us" 
                onPress={onattendanceCalendar}
                buttonColor="#228b22" // Purple
                textColor="white"
              />
            </View>

            <Text style={styles.footerText}>© 2025 Mohit Sinha Education</Text>
          </View>
        </LinearGradient>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  schoollogo: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    resizeMode: "cover",
    marginTop: 10,
    marginBottom: 10,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    width: '95%',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    paddingVertical: 30,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 5,
  },
  subHeaderText: {
    fontSize: 18,
    color: '#e0e0e0',
    textAlign: 'center',
  },
  buttonRowContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    flexWrap: 'wrap',
    marginVertical: 20,
  },
  footerText: {
    color: '#cccccc',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 'auto',
  }
});

export default Index;