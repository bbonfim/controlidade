package com.controlidade.platform;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class TransformController {

  @Autowired
  private ProductRepository repository;

  @RequestMapping(value = "/")
  public String index() {
    return "dashboard1";
  }

  @RequestMapping(value = "/search")
  public String search() {
    return "search";
  }

  @RequestMapping(value = "/create")
  public String create() {
    return "create";
  }

  @RequestMapping(value = "/dashboard1")
  public String dashboard1() {
    return "dashboard1";
  }

  @RequestMapping(value = "/login")
  public String login(Model model) {
    return "login";
  }


}