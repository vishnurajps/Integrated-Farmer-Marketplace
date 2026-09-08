package com.ifmap.dto;

public class UserProfileResponse {

    private Long id;

    private String fullName;

    private String mobile;

    private String email;

    private String role;

    private String state;

    private String district;

    private String address;


    public UserProfileResponse() {
    }


    public UserProfileResponse(
            Long id,
            String fullName,
            String mobile,
            String email,
            String role,
            String state,
            String district,
            String address
    ) {

        this.id = id;
        this.fullName = fullName;
        this.mobile = mobile;
        this.email = email;
        this.role = role;
        this.state = state;
        this.district = district;
        this.address = address;

    }


    public Long getId() {
        return id;
    }


    public void setId(Long id) {
        this.id = id;
    }


    public String getFullName() {
        return fullName;
    }


    public void setFullName(String fullName) {
        this.fullName = fullName;
    }


    public String getMobile() {
        return mobile;
    }


    public void setMobile(String mobile) {
        this.mobile = mobile;
    }


    public String getEmail() {
        return email;
    }


    public void setEmail(String email) {
        this.email = email;
    }


    public String getRole() {
        return role;
    }


    public void setRole(String role) {
        this.role = role;
    }


    public String getState() {
        return state;
    }


    public void setState(String state) {
        this.state = state;
    }


    public String getDistrict() {
        return district;
    }


    public void setDistrict(String district) {
        this.district = district;
    }


    public String getAddress() {
        return address;
    }


    public void setAddress(String address) {
        this.address = address;
    }

}