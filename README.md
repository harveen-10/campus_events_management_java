### Install all packages in frontend and backend folders by running this command in both-

``` npm i ```

### To run frontend

``` npm run dev ```


### In backend-java/src/main/resources/application.properties-

Change the password to your MySQL password

### To run backend

``` mvn spring-boot:run ```


### Create statements for the Tables

-- Create users table 
```sql
CREATE TABLE users ( 
    user_id INT AUTO_INCREMENT PRIMARY KEY, 
    name VARCHAR(100) NOT NULL, 
    email VARCHAR(100) NOT NULL UNIQUE, 
    srn VARCHAR(20) NOT NULL UNIQUE, 
    password VARCHAR(255) NOT NULL 
);
```

-- Create events table 
```sql
CREATE TABLE events ( 
EventID VARCHAR(20) PRIMARY KEY, 
Ename VARCHAR(100) NOT NULL, 
Event_date DATE NOT NULL, 
S_time TIME NOT NULL, 
E_time TIME NOT NULL, 
Category varchar(50), 
Domain varchar(50), 
Poster TEXT 
); 
```

-- Create organizers table 
```sql
CREATE TABLE organizers ( 
SRN VARCHAR(20) PRIMARY KEY, 
Name VARCHAR(100), 
Email VARCHAR(100), 
phone_no VARCHAR(10) 
); 
```

-- Create organizedby table 
```sql
CREATE TABLE organized_by ( 
EventID VARCHAR(20), 
SRN VARCHAR(20), 
PRIMARY KEY (EventID, SRN), 
FOREIGN KEY (EventID) REFERENCES events(EventID), 
FOREIGN KEY (SRN) REFERENCES organizers(SRN) 
); 
```

-- Create participants table 
```sql
CREATE TABLE participants ( 
SRN VARCHAR(20), 
Name VARCHAR(100), 
Email VARCHAR(100), 
TeamID VARCHAR(20), 
EventID VARCHAR(20), 
phone_no VARCHAR(10), 
PRIMARY KEY (SRN, EventID), 
FOREIGN KEY (EventID) REFERENCES events(EventID), 
FOREIGN KEY (TeamID) REFERENCES teams(TeamID) 
); 
```

-- Create teams table 
```sql
CREATE TABLE teams ( 
TeamID VARCHAR(20) PRIMARY KEY, 
Team_name VARCHAR(100), 
EventID VARCHAR(20), 
FOREIGN KEY (EventID) REFERENCES events(EventID) 
); 
```

-- Create sponsors table 
```sql
CREATE TABLE sponsors ( 
ID VARCHAR(20), 
Name VARCHAR(100), 
Email VARCHAR(100), 
Contribution DECIMAL(10, 2), 
phone_no VARCHAR(10), 
EventID VARCHAR(20), 
PRIMARY KEY (ID, EventID), 
FOREIGN KEY (EventID) REFERENCES events(EventID) 
); 
```

-- Create guests table 
```sql
CREATE TABLE guests ( 
ID VARCHAR(20), 
Name VARCHAR(100), 
Email VARCHAR(100), 
Role VARCHAR(50), 
phone_no VARCHAR(10), 
EventID VARCHAR(20), 
PRIMARY KEY (ID, EventID), 
FOREIGN KEY (EventID) REFERENCES events(EventID) 
); 
```

-- Create finances table 
```sql
CREATE TABLE finances ( 
TransID VARCHAR(20) PRIMARY KEY, 
EventID VARCHAR(20), 
SpentOn VARCHAR(100), 
Amount DECIMAL(10, 2), 
Receipt TEXT, 
FOREIGN KEY (EventID) REFERENCES events(EventID) 
);
```
