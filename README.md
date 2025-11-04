# Club-Hive - 🎓 College Club Management System

## 🔄 Flow

1.  **Login / Register**
    -   User logs in as **Student** or **Club Head**.
2.  **Home Page**
    -   Shows upcoming events and calendar.
3.  **Student Side**
    -   View all clubs\
    -   Follow clubs\
    -   View Followed clubs
    -   Register for events\
    -   View registered events
4.  **Club Head Side**
    -   Create new events\
    -   Manage (edit/delete) events\
    -   View student registrations
5.  **Calendar**
    -   Common for all users to avoid event clashes.
6.  **Logout**
    -   End session and return to login.

------------------------------------------------------------------------

## 🗄️ Database Schema

### 1. `students`

  Column Name   Data Type                          Constraints
  ------------- ---------------------------------- --------------------
  student_id    INT                                PK, AUTO_INCREMENT
  name          VARCHAR(100)                       NOT NULL
  email         VARCHAR(100)                       UNIQUE, NOT NULL
  year          ENUM('1st', '2nd', '3rd', '4th')   NOT NULL
  class         VARCHAR(50)                        NOT NULL
  section       VARCHAR(10)                        NOT NULL
  password      VARCHAR(255)                       NOT NULL (hashed)

------------------------------------------------------------------------

### 2. `clubs`

  Column Name   Data Type      Constraints
  ------------- -------------- --------------------
  club_id       INT            PK, AUTO_INCREMENT
  club_name     VARCHAR(100)   UNIQUE, NOT NULL
  description   TEXT           
  club_email    VARCHAR(100)   UNIQUE, NOT NULL
  password      VARCHAR(255)   NOT NULL (hashed)

------------------------------------------------------------------------

### 3. `events`

  Column Name   Data Type      Constraints
  ------------- -------------- ---------------------
  event_id      INT            PK, AUTO_INCREMENT
  event_name    VARCHAR(100)   NOT NULL
  club_id       INT            FK → clubs(club_id)
  date          DATE           NOT NULL
  time          TIME           NOT NULL
  venue         VARCHAR(100)   NOT NULL
  motive        TEXT           

------------------------------------------------------------------------

### 4. `event_registrations`

> Tracks which student registered for which event.

  Column Name         Data Type   Constraints
  ------------------- ----------- ---------------------------
  student_id          INT         FK → students(student_id)
  event_id            INT         FK → events(event_id)
  registration_date   DATETIME    DEFAULT CURRENT_TIMESTAMP

**Primary Key:** (student_id, event_id)

------------------------------------------------------------------------

### 5. `club_followers`

> Tracks which student follows which club.

  Column Name   Data Type   Constraints
  ------------- ----------- ---------------------------
  student_id    INT         FK → students(student_id)
  club_id       INT         FK → clubs(club_id)

**Primary Key:** (student_id, club_id)

------------------------------------------------------------------------

## 🔗 Relationships Summary

-   1 student → many registrations (`event_registrations`)
-   1 student → many follows (`club_followers`)
-   1 club → many events (`events`)
-   many students ↔ many events (through `event_registrations`)
-   many students ↔ many clubs (through `club_followers`)

------------------------------------------------------------------------

## 🌐 Endpoints Overview

### Login Page

-   Login as student or club.

### Sign Up

-   New student or club (updates the `students` or `clubs` table).

### Club Login

-   Redirects to club dashboard.

### Home Page (club)
    Nav bar with links to:
    Home
    Create Events page
    Manage events page
    Registrations page
    Display:
-   Upcoming events\
-   Global calendar\
-   Club details

### Create Events Page
Navigation bar same as home page of club 
Adds a new record to the `events` table with: - Event name\
- Date\
- Time\
- Venue\
- Motive\
- Club ID (determined by the logged-in club)

### Manage Events
Navigation bar same as home page of club 
Displays and allows management of events from the `events` table: -
Upcoming events (based on date) - Past events - Event details in
dropdowns

### Registrations Page
Navigation bar same as home page of club 
Displays registered students for each event using
`event_registrations`: - Upcoming and past events - Student details
(e.g., email)

------------------------------------------------------------------------

## 🏠 Home Page students

**Tables used:** `students`, `events`, `clubs`, `club_followers`

-   Navigation bar with links to:
    -   Home
    -   All Clubs
    -   My Clubs
    -   Registered Events
-   Display:
    -   Calendar
    -   All upcoming events
    -   Upcoming events from followed clubs

------------------------------------------------------------------------

## 🏛️ Clubs Page

**Tables used:** `clubs`, `events`, `club_followers`, `students`

-   Navigation bar same as home page of students
-   Display:
    -   Club name
    -   Upcoming event name
    -   **Details button** → when clicked shows the upcoming events for that club and a register button
    -   **Follow button** → allows student to follow the club

------------------------------------------------------------------------

## ⭐ My Clubs Page

**Tables used:** `club_followers`, `clubs`, `events`
    Navigation bar same as home page of students
-   Displays only the clubs followed by the logged-in student\
-   Shows:
    -   Club name\
    -   Upcoming event name\
    -   Details button (for event info)

------------------------------------------------------------------------

## 📝 Registered Events Page

**Tables used:** `event_registrations`, `events`, `clubs`, `students`
    Navigation bar same as home page of students
-   Displays events the student has registered for\
-   Shows:
    -   Club name\
    -   Event details (venue, time, etc.)

------------------------------------------------------------------------

## 📄 Details Page

**Tables used:** `events`, `students`, `event_registrations`

-   Displays full event details (venue, time, etc.)\
-   **Register button:**
    -   Prompts for password verification\
    -   On success → shows "Successfully registered"\
    -   On failure → shows error message

------------------------------------------------------------------------

## 📋 Tables Summary

  -----------------------------------------------------------------------
  Table                           Columns
  ------------------------------- ---------------------------------------
  **Students**                    student_id (PK), name, email, year,
                                  class, section, password

  **Clubs**                       club_id (PK), club_name, description,
                                  club_mail, password

  **Events**                      event_id (PK), event_name, club_id
                                  (FK), date, time, venue, motive

  **Club Followers**              student_id (FK), club_id (FK)

  **Event Registrations**         student_id (FK), event_id (FK),
                                  registration_date
  -----------------------------------------------------------------------
