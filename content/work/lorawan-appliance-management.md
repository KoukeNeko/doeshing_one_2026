---
title: "IoT Smart Switch - LoRaWAN-Based Electrical Appliance Management System"
description: "Award-winning IoT system leveraging LoRaWAN for long-range electrical appliance monitoring and control, with real-time power consumption analysis and predictive maintenance capabilities."
tags: ["LoRaWAN", "IoT", "LPWAN", "ChirpStack", "MongoDB", "WebSocket", "Smart Campus"]
image: "/images/projects/lorawan.svg"
github: ""
demo: "https://wp.me/pgdJCe-3f"
date: "2024-06"
featured: true
status: "completed"
---

## Project Overview

An intelligent IoT platform designed to monitor, control, and analyze electrical appliances across National Yunlin University of Science & Technology campus using LoRaWAN technology. The system provides real-time power consumption monitoring, automated scheduling, and predictive maintenance to serve as the foundation for future smart campus infrastructure.

**Recognition:** Second Place, 2023 Practical Project Competition and Results Presentation

## Motivation

Campus facilities management at National Yunlin University faces several challenges:
- Electrical equipment failures cause inconvenience and potential safety hazards
- Reactive maintenance approach leads to extended downtime
- No centralized monitoring of equipment health status
- Inefficient energy consumption without automated control

Our solution enables proactive maintenance through power consumption analysis, detecting anomalies like abnormal heating or extended startup times before equipment failure occurs. The system also provides automated scheduling capabilities for energy optimization.

## Technical Architecture

### System Components

<div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
  <div className="border rounded-lg p-4">
    <h4 className="font-bold mb-2">Hardware Layer</h4>
    <ul className="space-y-2">
      <li>• <strong>LoRa Node Device:</strong> RAK3172 + RAK19007</li>
      <li>• <strong>Gateway:</strong> RAK7289v2 (8-channel, IP67)</li>
      <li>• <strong>Sensors:</strong> PZEM-004T power monitoring</li>
      <li>• <strong>Control:</strong> Relay-based switching</li>
    </ul>
  </div>
  
  <div className="border rounded-lg p-4">
    <h4 className="font-bold mb-2">Software Stack</h4>
    <ul className="space-y-2">
      <li>• <strong>Network Server:</strong> ChirpStack (LoRaWAN 1.0.3)</li>
      <li>• <strong>Message Broker:</strong> Eclipse Mosquitto (MQTT)</li>
      <li>• <strong>Database:</strong> MongoDB + PostgreSQL + Redis</li>
      <li>• <strong>Web Server:</strong> Nginx</li>
      <li>• <strong>API:</strong> Custom backend with gRPC</li>
    </ul>
  </div>
</div>

### LoRa Technology Deep Dive

**Why LoRa over WiFi/Zigbee:**
- **Range:** Up to 15km in optimal conditions vs. 100m for WiFi
- **Power:** Years of battery life vs. days/weeks
- **Penetration:** Superior building penetration
- **Scalability:** Single gateway supports thousands of devices
- **Cost:** Lower infrastructure and operational costs

**Technical Specifications:**
- **Frequency:** US915 band
- **Modulation:** Chirp Spread Spectrum (CSS)
- **Data Rate:** 980 bps to 21,900 bps (configurable)
- **Spreading Factor:** SF7-SF12 (higher SF = longer range, lower speed)
- **Device Class:** Class C (continuous reception for fastest response)

### Data Flow Architecture

```
┌─────────────┐
│   Device    │ LoRa      ┌──────────┐
│  (RAK3172)  ├──────────▶│ Gateway  │
└─────────────┘           │(RAK7289) │
                          └─────┬────┘
                                │ WebSocket
                                ▼
                    ┌───────────────────┐
                    │  ChirpStack GW    │
                    │     Bridge        │
                    └─────────┬─────────┘
                              │ MQTT
                              ▼
      ┌──────────────┬────────────────┬─────────────┐
      │              │                │             │
      ▼              ▼                ▼             ▼
┌──────────┐  ┌──────────┐    ┌──────────┐  ┌──────────┐
│ChirpStack│  │   MQTT   │    │ Schedule │  │   API    │
│          │  │ Receiver │    │ Operator │  │          │
└────┬─────┘  └────┬─────┘    └────┬─────┘  └────┬─────┘
     │             │               │             │
     └─────────────┴───────────────┴─────────────┘
                         │
                         ▼
                  ┌──────────────┐
                  │   MongoDB    │
                  └──────────────┘
```

## Core Features

### 1. Real-Time Monitoring & Control

**Power Consumption Tracking:**
- Continuous monitoring via PZEM-004T module
- Data transmission every 5 minutes (configurable)
- Real-time visualization dashboard
- Historical data analysis and reporting

**Remote Control:**
- Instant on/off switching via LoRa downlink
- Status confirmation and feedback
- Group control capabilities
- Emergency override functions

### 2. Intelligent Scheduling

**Automated Operations:**
- Weekly recurring schedules
- Time-based automation
- Group and individual device scheduling
- Priority-based conflict resolution (device > group)

**Schedule Operator:**
- Polls MongoDB every minute for pending schedules
- Executes control commands via ChirpStack gRPC API
- Handles device restoration after power loss

### 3. Predictive Maintenance System

**Health Status Classification:**
- **Healthy:** Normal operation within baseline range
- **Warning:** Power consumption ±10% from group median for 5+ minutes
- **Error:** Device powered on but zero power consumption detected
- **Timeout:** Unable to establish downlink communication

**Alert System:**
- Real-time Discord bot notifications
- Mobile push notifications (planned)
- Maintenance recommendations
- Historical anomaly tracking

### 4. Custom LoRaWAN Protocol

**FPort Mapping:**

| Direction | FPort | Function | Payload Format |
|-----------|-------|----------|----------------|
| Uplink | 32 | Power data | `[high_byte][low_byte][decimal]` watts |
| Uplink | 33 | Switch status | `0x00` = OFF, else ON |
| Uplink | 34 | Status request | No payload |
| Downlink | 33 | Control switch | `0x00` = OFF, else ON |

## Implementation Highlights

### Hardware Integration

**Custom PCB Design** (by lab senior Lin Zhi-Xuan):
- RAK3172 LoRa module integration
- PZEM-004T power monitoring interface
- Relay control circuit
- Voltage regulation and protection
- Compact form factor for installation

**Gateway Deployment:**
- RAK7289v2 with IP67 weatherproofing
- Rooftop installation for campus-wide coverage
- Ethernet backhaul via campus network
- Basic Station mode configuration

### Software Architecture Decisions

**Device Initialization Challenge:**
Due to RAK3172 firmware issues requiring occasional reflashing (which erases IEEE-issued DevEUI), we implemented:
- Custom DevEUI generation and validation
- Serial port initialization interface
- Automated AT command injection
- Database synchronization with ChirpStack

**Database Strategy:**
- **MongoDB:** Time-series power consumption data, schedules, device metadata
- **PostgreSQL:** ChirpStack configuration and LoRaWAN session data
- **Redis:** Short-term caching and duplicate packet elimination

**Frontend Features:**
- Group overview with aggregate statistics
- Device list with health indicators
- Power consumption visualization (daily/hourly/minute granularity)
- Interactive schedule management
- Real-time WebSocket updates

## Deployment

**Current Status:**
- Deployed across multiple campus buildings
- Managing fluorescent lighting and electrical equipment
- 24/7 monitoring and control capabilities
- Integration with facilities management workflows

**Scalability:**
- Docker-compose based deployment
- Horizontal scaling via Kubernetes (future)
- Multiple gateway support
- Load-balanced API endpoints

## Team & Recognition

**Team Members:**
- Tian Yi-Nuo (田以諾) - System architect, backend development
- Huang Wei-Cheng (黃韋誠) - Hardware integration, firmware
- Chen De-Sheng (陳德生) - Frontend development, UI/UX

**Advisor:** Dr. Ching-Lung Chang (張慶龍 博士)

**Special Thanks:** Lin Zhi-Xuan (林志軒) - Hardware design and RAKwireless internship expertise

**Award:** Second Place, Department of Computer Science & Information Engineering Practical Project Competition (June 2024)

## Future Enhancements

### Short-term (6 months)
1. **Wireless Configuration Interface**
   - Bluetooth Low Energy for device setup
   - Mobile app for field initialization
   - Eliminate USB serial connection requirement

2. **FUOTA Support**
   - Firmware updates over LoRaWAN
   - Reduced maintenance overhead
   - Utilize standard IEEE DevEUI

### Medium-term (1 year)
3. **Advanced Analytics**
   - Machine learning for consumption prediction
   - Anomaly detection refinement
   - Equipment lifecycle modeling

4. **Campus System Integration**
   - Integration with university portal
   - Role-based access control
   - Department-level management

### Long-term (2+ years)
5. **Smart Campus Foundation**
   - Expand to HVAC systems
   - Environmental sensor integration
   - Comprehensive energy management platform

## Technical Documentation

Detailed implementation guides available:
- Hardware assembly instructions
- Firmware configuration procedures
- Server deployment playbook
- API documentation

[Read Full Technical Report](https://wp.me/pgdJCe-3f)

## Key Learnings

**Technical Insights:**
- LoRaWAN Class C required for responsive control despite higher power consumption
- MongoDB aggregation pipelines crucial for efficient time-series queries
- gRPC provides excellent performance for ChirpStack integration
- QoS 2 MQTT essential for duplicate packet elimination

**Project Management:**
- Hardware-software co-design requires extensive coordination
- Field testing revealed issues not apparent in lab environment
- Documentation critical for maintenance handoff
- User feedback drove iterative UI improvements

## Conclusion

This LoRaWAN-based smart switch system demonstrates the viability of LPWAN technology for campus-wide IoT deployments. By providing real-time monitoring, automated control, and predictive maintenance capabilities, the system serves as a foundation for National Yunlin University's smart campus initiative while delivering immediate energy efficiency and operational benefits.

The project successfully addresses the challenges of large-scale electrical infrastructure management through innovative use of LoRaWAN technology, thoughtful system architecture, and user-centric design.

---
![image alt](https://media.licdn.com/dms/image/v2/D5622AQFbVbu4OsMstA/feedshare-shrink_1280/feedshare-shrink_1280/0/1705922614777?e=1762992000&v=beta&t=Wt1cNecDIriF25s0W36AIen_AV08vqeD6nrzgdSYBfE)

*Project completed June 2024 | National Yunlin University of Science & Technology*
