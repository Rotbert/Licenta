import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import ContactiListItem from "../components/ContactListItem";
import db, { auth } from "../firebase";

const ContactsScreen = () => {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const unsubscribe = db.collection("users").onSnapshot((snapshot) =>
        setContacts(
        snapshot.docs
          .filter((doc) => {
            if (doc.id !== auth.currentUser.email) {
              return true;
            }
            return false;
          })
          .map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
      )
    );

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <View style={styles.container}>
      {contacts.map((contact) => (
        <ContactiListItem
          key={contact.id}
          id={contact.id}
          email={contact.id}
        />
      ))}
    </View>
  );
};

export default ContactsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
