import 'package:flutter/material.dart';
import 'package:sample_flutter_app/computer/component.dart';

class GeneratedExamples extends StatefulWidget{
  @override
  State<StatefulWidget> createState() => _GeneratedExamplesState();

}

class _GeneratedExamplesState extends State<GeneratedExamples>{
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // body: _buildBody()
      body: SingleChildScrollView(
        child: _buildBody(),
      ),
    );
  }
  Widget _buildBody(){
    return Component();
  }
}