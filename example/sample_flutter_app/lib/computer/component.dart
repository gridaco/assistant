import 'package:flutter/material.dart';
class Component extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Container(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Container(
                  child: Container(
                    child: Container(
                      child: Row(
                        children: [
                          Container(
                            child: Stack(
                              children: [
                                Positioned.fill(
                                  child: Align(
                                    alignment: Alignment.topLeft,
                                  ),
                                ),
                                Opacity(
                                  opacity: 0.5,
                                  child: Container(
                                    width: 24,
                                    height: 24,
                                  ),
                                ),
                              ],
                            ),
                            width: 24,
                            height: 24,
                          ),
                          SizedBox(
                            width: 8,
                          ),
                          SizedBox(
                            child: Text(
                              "Profile",
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w400,
                                fontFamily: "Roboto",
                              ),
                            ),
                            width: 295,
                          ),
                        ],
                        mainAxisSize: MainAxisSize.min,
                      ),
                    ),
                  ),
                  padding: EdgeInsets.symmetric(
                    horizontal: 24,
                    vertical: 12,
                  ),
                ),
                Container(
                  child: Opacity(
                    opacity: 0.5,
                    child: Container(
                      width: 327,
                      height: 1,
                      decoration: BoxDecoration(
                        color: Color(
                          0xffe9ecef,
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
          Container(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Container(
                  child: Container(
                    child: Container(
                      child: Row(
                        children: [
                          Container(
                            child: Container(
                              child: Opacity(
                                opacity: 0.5,
                                child: Container(
                                  width: 22,
                                  height: 12,
                                  decoration: BoxDecoration(
                                    color: Color(
                                      0xff343a40,
                                    ),
                                  ),
                                ),
                              ),
                              padding: EdgeInsets.symmetric(
                                horizontal: 1,
                                vertical: 6,
                              ),
                            ),
                          ),
                          SizedBox(
                            width: 8,
                          ),
                          SizedBox(
                            child: Text(
                              "Switch Account",
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w400,
                                fontFamily: "Roboto",
                              ),
                            ),
                            width: 295,
                          ),
                        ],
                        mainAxisSize: MainAxisSize.min,
                      ),
                    ),
                  ),
                  padding: EdgeInsets.symmetric(
                    horizontal: 24,
                    vertical: 12,
                  ),
                ),
                Container(
                  child: Opacity(
                    opacity: 0.5,
                    child: Container(
                      width: 327,
                      height: 1,
                      decoration: BoxDecoration(
                        color: Color(
                          0xffe9ecef,
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
          Container(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Container(
                  child: Container(
                    child: Container(
                      child: Row(
                        children: [
                          Container(
                            child: Container(
                              child: Opacity(
                                opacity: 0.5,
                                child: Container(
                                  width: 18,
                                  height: 18,
                                  decoration: BoxDecoration(
                                    color: Color(
                                      0xff343a40,
                                    ),
                                  ),
                                ),
                              ),
                              padding: EdgeInsets.all(
                                3,
                              ),
                            ),
                          ),
                          SizedBox(
                            width: 8,
                          ),
                          SizedBox(
                            child: Text(
                              "Logout",
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w400,
                                fontFamily: "Roboto",
                              ),
                            ),
                            width: 295,
                          ),
                        ],
                        mainAxisSize: MainAxisSize.min,
                      ),
                    ),
                  ),
                  padding: EdgeInsets.symmetric(
                    horizontal: 24,
                    vertical: 12,
                  ),
                ),
                Visibility(
                  child: Container(
                    child: Opacity(
                      opacity: 0.5,
                      child: Container(
                        width: 327,
                        height: 1,
                        decoration: BoxDecoration(
                          color: Color(
                            0xffe9ecef,
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
      padding: EdgeInsets.symmetric(
        vertical: 8,
      ),
      decoration: BoxDecoration(
        color: Color(
          0xfff8f9fa,
        ),
      ),
    );
  }
}